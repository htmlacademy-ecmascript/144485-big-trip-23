import AbstractView from '../framework/view/abstract-view.js';
import { appDay } from '../utils/day.js';
import { getDuration } from '../utils/util.js';

const createWaypoint = (waypoint, destinationCurrent, offers) => {
  const { basePrice: price, dateFrom: ISOFrom, dateTo: ISOTo, isFavorite, type, offers: offersPoint } = waypoint;
  const dayStart = appDay(ISOFrom).format('MMM D');
  const dateStart = appDay(ISOFrom).format('YYYY-MM-DD');
  const timeFrom = appDay(ISOFrom).format('HH:mm');
  const datetimeFrom = appDay(ISOFrom).format('YYYY-MM-DDTHH:mm');
  const timeTo = appDay(ISOTo).format('HH:mm');
  const datetimeTo = appDay(ISOTo).format('YYYY-MM-DDTHH:mm');
  const duration = getDuration(ISOFrom, ISOTo);
  const isFavoriteClass = isFavorite ? ' event__favorite-btn--active' : '';
  const typePicture = type.toLowerCase();

  const pointTypeOffer = offers.find((offer) => offer.type === type);

  const createOffersTemplate = () => {
    if (!pointTypeOffer) {
      return '';
    }

    return pointTypeOffer.offers.filter((offer) => offersPoint.includes(offer.id)).map((offer) => `<li class="event__offer">
                    <span class="event__offer-title">${offer.title}</span>
                    &plus;&euro;&nbsp;
                    <span class="event__offer-price">${offer.price}</span>
                  </li>`).join('');
  };

  const pointTypeList = createOffersTemplate();

  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateStart}">${dayStart}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${typePicture}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} -- ${destinationCurrent.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${datetimeFrom}">${timeFrom}</time>
      —
      <time class="event__end-time" datetime="${datetimeTo}">${timeTo}</time>
    </p>
    <p class="event__duration">${duration}</p>
  </div>
  <p class="event__price">
    €&nbsp;<span class="event__price-value">${price ? price : 0}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${pointTypeList}
  </ul>
  <button class="event__favorite-btn ${isFavoriteClass}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;
};

export default class Waypoint extends AbstractView {
  #waypoint = null;
  #destinations = null;
  #onClickButtonRollup = null;
  #onFavoriteClick = null;
  #rollupButton = null;
  #favoriteButton = null;
  #destinationCurrent = null;
  #offerCurrent = null;
  #offers = null;

  constructor({ waypoint, onClickButtonRollup, destinations, onFavoriteClick, offerCurrent, destinationCurrent, offers }) {
    super();
    this.#waypoint = waypoint;
    this.#offerCurrent = offerCurrent;
    this.#offers = offers;
    this.#onClickButtonRollup = onClickButtonRollup;
    this.#destinations = destinations;
    this.#destinationCurrent = destinationCurrent;
    this.#onFavoriteClick = onFavoriteClick;
    this.#rollupButton = this.element.querySelector('.event__rollup-btn');
    this.#rollupButton.addEventListener('click', this.#onClickButtonRollupHandler);
    this.#favoriteButton = this.element.querySelector('.event__favorite-btn');
    this.#favoriteButton.addEventListener('click', this.#onFavoriteClickHandler);

  }

  get template() {
    return createWaypoint(this.#waypoint, this.#destinationCurrent, this.#offers);
  }

  #onFavoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

  #onClickButtonRollupHandler = (evt) => {
    evt.preventDefault();
    this.#onClickButtonRollup();
  };
}
