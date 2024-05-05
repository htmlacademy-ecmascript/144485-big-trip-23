import { createElement } from '../render.js';
import { destinationCreateAll } from '../mock/destination.js';
import { createRandomOffers } from '../mock/offer-mock.js';
import dayjs from 'dayjs';

const createOfferMarkup = (offer) => `<li class="event__offer">
<span class="event__offer-title">${offer.title}</span>
&plus;&euro;&nbsp;
<span class="event__offer-price">${offer.price}</span>
</li>`;

const getOffersChoose = (type, offerChoose) => {
  const getOffersAll = createRandomOffers();
  const getCurrentOffer = getOffersAll.find((element) => element.type === type);
  let offers;
  if (getCurrentOffer && getCurrentOffer.offer && getCurrentOffer.offer.length) {
    const offersChoose = getCurrentOffer.offer.filter((obj) => offerChoose.includes(obj.id));
    offers = offersChoose.map(createOfferMarkup).join('');

    return offers;
  }
};

const getDuration = (beginISO, endISO) => {
  const getTimeDiff = () => {
    const startDate = dayjs(beginISO).toDate();
    const endDate = dayjs(endISO).toDate();
    const resultDict = new Date(endDate - startDate);

    return {
      days: resultDict.getUTCDate() - 1,
      hours: resultDict.getUTCHours(),
      minutes: resultDict.getUTCMinutes(),
    };
  };

  const timeDifference = getTimeDiff();
  const resultArray = [];

  if (timeDifference.days !== 0) {
    resultArray[0] = `${String(timeDifference.days).padStart(2, '0')}D`;
  }
  if (timeDifference.hours !== 0) {
    resultArray[1] = `${String(timeDifference.hours).padStart(2, '0')}H`;
  }
  if (timeDifference.minutes !== 0) {
    resultArray[2] = `${String(timeDifference.minutes).padStart(2, '0')}M`;
  }

  return resultArray.join(' ');
};

const getDestination = (id) => {
  const allDestination = destinationCreateAll();
  const getCurrentDestination = allDestination.find((element) => element.id === id);
  return getCurrentDestination;
};

const createWaypoint = (waypoint) => {
  const { basePrice: price, dateStart: ISOFrom, dateEnd: ISOTo, destination: idDestination, isFavorite, type, offers: offersChoose } = waypoint;
  const dayStart = dayjs(ISOFrom).format('MMM D');
  const dateStart = dayjs(ISOFrom).format('YYYY-MM-DD');
  const timeFrom = dayjs(ISOFrom).format('HH:mm');
  const datetimeFrom = dayjs(ISOFrom).format('YYYY-MM-DDTHH:mm');
  const timeTo = dayjs(ISOTo).format('HH:mm');
  const datetimeTo = dayjs(ISOTo).format('YYYY-MM-DDTHH:mm');
  const duration = getDuration(ISOFrom, ISOTo);
  const isFavoriteClass = isFavorite ? ' event__favorite-btn--active' : '';
  const destination = getDestination(idDestination);
  const offers = getOffersChoose(type, offersChoose);

  return `<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${dateStart}">${dayStart}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} -- ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${datetimeFrom}">${timeFrom}</time>
      —
      <time class="event__end-time" datetime="${datetimeTo}">${timeTo}</time>
    </p>
    <p class="event__duration">${duration}</p>
  </div>
  <p class="event__price">
    €&nbsp;<span class="event__price-value">${price}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offers}
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

export default class Waypoint {
  constructor({ waypoint }) {
    this.waypoint = waypoint;
  }

  getTemplate() {
    return createWaypoint(this.waypoint);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
