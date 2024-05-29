import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { EVENT_TYPES } from '../mock/variablies.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { appDay } from '../utils.js/day.js';

const createPhoto = (photo) => `<img class="event__photo" src="${photo.src}" alt="Event photo">`;
const createCityItem = (city) => `<option value="${city}"></option>`;
const createTypeItem = (typeName) => `<div class="event__type-item">
<input id="event-type-${typeName}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeName}">
<label class="event__type-label  event__type-label--${typeName.toLowerCase()}" for="event-type-${typeName}" style>${typeName}</label>
</div>`;

const createOfferItem = (item) => `<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${item.id}" type="checkbox" name="event-offer-luggage">
<label class="event__offer-label" for="event-offer-luggage-${item.id}">
  <span class="event__offer-title">${item.title}</span>
  +€&nbsp;
  <span class="event__offer-price">${item.price}</span>
</label>
</div>`;

const createOfferList = (arr) => arr.map(createOfferItem).join('');
const createTypeList = (arr) => arr.map(createTypeItem).join('');

const createCityList = (arr) => {
  const cities = arr.map((element) => element.name);
  return cities.map(createCityItem).join('');
};
const createPhotoList = (arr) => arr.map(createPhoto).join('');

const createWaypointForm = (waypoint, destinationAll, offersModelAll) => {
  const { type, dateFrom, dateTo, basePrice } = waypoint;

  const offerCurrent = offersModelAll.find((item) => item.type === waypoint.type);
  const destinationCurrent = destinationAll.find((item) => item.id === waypoint.destination);
  const { name: destinationName, description: destinationDescription } = destinationCurrent;

  const photoItems = createPhotoList(destinationCurrent.pictures);
  const cityList = createCityList(destinationAll);
  const typeList = createTypeList(EVENT_TYPES);
  const offerList = createOfferList(offerCurrent.offer);
  const parsDateTo = appDay(dateTo);
  const parsDateFrom = appDay(dateFrom);

  return `<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typeList}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination- ${type}">
        ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination- ${type}" type="text" name="event-destination" value="${destinationName}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${cityList}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${parsDateFrom.format('DD/MM/YY HH:mm')}">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${parsDateTo.format('DD/MM/YY HH:mm')}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
    ${
      offerList.length > 0
        ? `
      <h3 class="event__section-title  event__section-title--offers" > Offers</h3 >
        <div class="event__available-offers">
          ${offerList}
        </div>
        `
        : ''
    }
    </section >

  <section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">${destinationName}</h3>
    <p class="event__destination-description">${destinationDescription}</p>
    ${
      photoItems.length > 0
        ? `
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${photoItems}
        </div>
      </div> `
        : ''
    }


  </section >
  </section >
</form >
</li > `;
};

export default class WaypointEdit extends AbstractStatefulView {
  #onEditFormRollupButtonClick = null;
  #buttonCansel = null;
  #destinationsModel = null;
  #offersModel = null;
  #destinationAll = [];
  #offerCurrent = [];
  #destinationCurrent = null;
  #buttonSave = null;
  #offersModelAll;
  #datepickerFrom = null;
  #datepickerTo = null;
  constructor({ waypoint, onEditFormRollupButtonClick, destinationsModel, offersModel }) {
    super();
    this._setState(WaypointEdit.parsePointToState(waypoint));
    this.#destinationsModel = destinationsModel;
    this.#onEditFormRollupButtonClick = onEditFormRollupButtonClick;
    this.#offersModel = offersModel;
    this.#offersModelAll = offersModel.offers;
    this.#offerCurrent = this.#offersModel.getCurrentOffer(this._state.type);
    this.#destinationAll = this.#destinationsModel.destinationAll;

    this._restoreHandlers();
  }

  get template() {
    return createWaypointForm(this._state, this.#destinationAll, this.#offersModelAll);
  }

  reset(waypoint) {
    this.updateElement(WaypointEdit.parsePointToState(waypoint));
  }

  _restoreHandlers() {
    this.#buttonCansel = this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onEditFormRollupButtonHandler);
    this.#buttonSave = this.element.querySelector('.event__save-btn').addEventListener('click', this.#onEditFormSaveHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeToggleHandler);
    this.element
      .querySelectorAll('.event__offer-selector input')
      .forEach((offer) => offer.addEventListener('change', this.#offersChangeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationToggleHandler);

    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  #eventDestinationToggleHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value !== '') {
      const selectedDestination = this.#destinationAll.find((destination) => evt.target.value === destination.name);

      this.updateElement({
        destination: selectedDestination.id,
      });
    }
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #offersChangeHandler = (evt) => {
    evt.preventDefault();
    evt.target.toggleAttribute('checked');

    let selectedOffers = this._state.offers;

    if (evt.target.hasAttribute('checked')) {
      selectedOffers.push(+evt.target.dataset.offerId);
    } else {
      selectedOffers = selectedOffers.filter((id) => id !== +evt.target.dataset.offerId);
    }

    this._setState({
      offers: selectedOffers,
    });
  };

  #onEditFormRollupButtonHandler = (evt) => {
    evt.preventDefault();
    this.#onEditFormRollupButtonClick();
  };

  #onEditFormSaveHandler = (evt) => {
    evt.preventDefault();
    this.#onEditFormRollupButtonClick();
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #dateFromChangeHadler = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom,
    });
  };

  #dateToChangeHadler = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo,
    });
  };

  #setDatePickerFrom() {
    this.#datepickerFrom = flatpickr(this.element.querySelector('input[name=event-start-time]'), {
      dateFormat: 'j/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#dateFromChangeHadler,
      enableTime: true,
    });
  }

  #setDatePickerTo() {
    this.#datepickerTo = flatpickr(this.element.querySelector('input[name=event-end-time]'), {
      dateFormat: 'j/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: this.#dateToChangeHadler,
      enableTime: true,
    });
  }

  static parsePointToState = (point) => ({ ...point });
  static parseStateToPoint = (state) => ({ ...state });
}
