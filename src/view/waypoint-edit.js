import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
// import { EVENT_TYPES } from '../mock/variablies.js';
import { validatePriceField } from '../utils.js/util.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { appDay } from '../utils.js/day.js';

const DefaultPointData = {
  DATE_FROM: appDay().toISOString(),
  DATE_TO: appDay().add(30, 'minutes').toISOString(),
  TYPE: 'taxi'
};

const BLANK_POINT = {
  basePrice: '',
  dateFrom: DefaultPointData.DATE_FROM,
  dateTo: DefaultPointData.DATE_TO,
  destination: '',
  id: '',
  isFavorite: false,
  offers: [],
  type: DefaultPointData.TYPE
};


const createCityItem = (city) => `<option value="${city}"></option>`;
const createTypeItem = (typeName) => `<div class="event__type-item">
<input id="event-type-${typeName}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeName}">
<label class="event__type-label  event__type-label--${typeName.toLowerCase()}" for="event-type-${typeName}" style>${typeName}</label>
</div>`;


const createTypeList = (arr) => {
  const types = arr.map(((element) => element.type));
  const uniqueTypes = Array.from(new Set(types));
  return uniqueTypes.map(createTypeItem).join('');
};

const createCityList = (arr) => {
  const cities = arr.map((element) => element.name);
  return cities.map(createCityItem).join('');
};


const createWaypointForm = (waypoint, destinations, offers, pointsModel) => {

  const { type, dateFrom, dateTo, basePrice, offers: offersPoint } = waypoint;

  const offerCurrent = offers.find((item) => item.type === waypoint.type);
  const destinationCurrent = destinations.find((item) => item.id === waypoint.destination);
  let offersTemplate = '';
  if (offerCurrent) {
    offersTemplate = `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${offerCurrent.offers.map((offer) => `
          <div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="${offer.id}" type="checkbox" name="${offer.title}" data-offer-id="${offer.id}" ${offersPoint.includes(offer.id) ? 'checked' : ''}>
            <label class="event__offer-label" for="${offer.id}">
              <span class="event__offer-title">${offer.title}</span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price">${offer.price}</span>
            </label>
          </div>`).join('')}
          </div>
      </section>`;
  }

  let photoList = '';
  if (destinationCurrent.pictures.length) {
    photoList = `<div class="event__photos-container">
    <div class="event__photos-tape">
      ${destinationCurrent.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}"></img>`).join('')}
    </div>
  </div>`;
  }

  let pointDestinationTemplate = '';
  if (destinationCurrent) {
    pointDestinationTemplate = `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationCurrent.description}</p>
      ${photoList}
    </section>`;
  }


  const cityList = createCityList(destinations);
  const typeList = createTypeList(pointsModel.event);
  const parsDateTo = appDay(dateTo);
  const parsDateFrom = appDay(dateFrom);
  const isNewPoint = !waypoint.id;
  const isValidForm = destinationCurrent && basePrice !== 0;
  // const submitBtnText = isSaving ? 'Saving...' : 'Save';
  // const deleteBtnText = isDeleting ? 'Deleting...' : 'Delete';
  // const resetBtnText = isNewPoint ? 'Cancel' : deleteBtnText;

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
      <input class="event__input  event__input--destination" id="event-destination- ${type}" type="text" name="event-destination" value="${destinationCurrent ? destinationCurrent.name : ''}" list="destination-list-1">
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
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${basePrice ? basePrice : 0}" required>
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isValidForm ? '' : 'disabled'}>Save</button>
    <button class="event__reset-btn" type="reset">${isNewPoint ? 'Cancel' : 'Delete'}</button>
    ${isNewPoint ? '' : `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`}
  </header>
  <section class="event__details">
  ${offersTemplate}
  ${pointDestinationTemplate}
  </section >
</form >
</li > `;
};

export default class WaypointEdit extends AbstractStatefulView {
  #onEditFormRollupButtonClick = null;
  #onDeleteForm = null;
  #destinations = null;
  #destinationAll = [];
  #offerCurrent = [];
  #destinationCurrent = null;
  #offers = null;
  #datepickerFrom = null;
  #datepickerTo = null;
  #onEditFormSave = null;
  #pointsModel = null;
  constructor({ waypoint = BLANK_POINT, onEditFormSave, onEditFormRollupButtonClick, onDeleteForm, offers, pointsModel, destinations }) {
    super();
    this._setState(WaypointEdit.parsePointToState(waypoint));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#onEditFormRollupButtonClick = onEditFormRollupButtonClick;
    this.#onEditFormSave = onEditFormSave;
    this.#pointsModel = pointsModel;
    this.#offerCurrent = this.#pointsModel.getCurrentOffer(this._state.type);
    this.#onDeleteForm = onDeleteForm;


    this._restoreHandlers();
  }

  get template() {
    return createWaypointForm(this._state, this.#destinations, this.#offers, this.#pointsModel);
  }

  reset(waypoint) {
    this.updateElement(WaypointEdit.parsePointToState(waypoint));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#onEditFormSaveHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onDeleteEditFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeToggleHandler);
    this.element.querySelectorAll('.event__offer-selector input').forEach((offer) => offer.addEventListener('change', this.#offersChangeHandler));
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#eventDestinationToggleHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change', this.#priceInputHandler);

    if (this._state.id) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#onEditFormRollupButtonHandler);
    }

    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  #eventDestinationToggleHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value !== '') {
      const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);
      this.updateElement({
        destination: selectedDestination.id,
      });
    }
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();

    this.updateElement({
      basePrice: validatePriceField(evt.target.value)
    });
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
      selectedOffers.push(evt.target.dataset.offerId);
    } else {
      selectedOffers = selectedOffers.filter((id) => id !== evt.target.dataset.offerId);
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
    this.#onEditFormSave(WaypointEdit.parseStateToPoint(this._state));
  };

  #onDeleteEditFormHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteForm(WaypointEdit.parseStateToPoint(this._state));

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

  #dateFromChangeHandler = ([dateFrom]) => {
    this.updateElement({
      dateFrom: dateFrom,
    });
  };

  #dateToChangeHandler = ([dateTo]) => {
    this.updateElement({
      dateTo: dateTo,
    });
  };

  #setDatePickerFrom() {
    this.#datepickerFrom = flatpickr(this.element.querySelector('input[name=event-start-time]'), {
      dateFormat: 'j/m/y H:i',
      defaultDate: this._state.dateFrom,
      onChange: this.#dateFromChangeHandler,
      enableTime: true,
    });
  }

  #setDatePickerTo() {
    this.#datepickerTo = flatpickr(this.element.querySelector('input[name=event-end-time]'), {
      dateFormat: 'j/m/y H:i',
      defaultDate: this._state.dateTo,
      onChange: this.#dateToChangeHandler,
      enableTime: true,
    });
  }

  static parsePointToState = (point) => ({ ...point });
  static parseStateToPoint = (state) => ({ ...state });
}
