import AbstractView from '../framework/view/abstract-view.js';
import { appDay } from '../utils/day.js';
import { calculateDuration } from '../utils/util.js';

const DATE_FORMAT = 'MMM DD';
const TIME_FORMAT = 'HH:mm';

const createWaypoint = (waypoint, destinationCurrent, offers) => {
  const { basePrice: price, dateFrom, dateTo, isFavorite, type, offers: offersPoint } = waypoint;
  const parsDateTo = appDay(dateTo);
  const parsDateFrom = appDay(dateFrom);
  const isFavoriteClass = isFavorite ? 'event__favorite-btn--active' : '';
  const typePicture = type.toLowerCase();
  const typeUp = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  const pointTypeOffer = offers.find((offer) => offer.type === type);

  const createOffersTemplate = () => {
    if (!pointTypeOffer) {
      return '';
    }

    return pointTypeOffer.offers
      .filter((offer) => offersPoint.includes(offer.id))
      .map(
        (offer) => `<li class="event__offer"><span class="event__offer-title">${offer.title}</span> +&euro;&nbsp;<span class="event__offer-price">${offer.price}</span</li>`,
      )
      .join('');
  };

  const pointTypeList = createOffersTemplate();

  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateFrom}">${parsDateFrom.format(DATE_FORMAT)}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${typePicture}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${typeUp} ${destinationCurrent ? destinationCurrent.name : ''}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${dateFrom}">${parsDateFrom.format(TIME_FORMAT)}</time> — <time class="event__end-time" datetime="${dateTo}">${parsDateTo.format(TIME_FORMAT)}</time>
    </p>
    <p class="event__duration">${calculateDuration(dateFrom, dateTo)}</p>
  </div >
  <p class="event__price">€&nbsp;<span class="event__price-value">${price ? price : 0}</span></p>
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
</div >
</li > `;
};

export default class Waypoint extends AbstractView {
  #waypoint = null;
  #onClickButtonRollup = null;
  #onFavoriteClick = null;
  #rollupButton = null;
  #favoriteButton = null;
  #destinationCurrent = null;
  #offers = null;

  constructor({ waypoint, onClickButtonRollup, onFavoriteClick, destinationCurrent, offers }) {
    super();
    this.#waypoint = waypoint;
    this.#offers = offers;
    this.#onClickButtonRollup = onClickButtonRollup;
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
