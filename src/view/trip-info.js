import { appDay } from '../utils/day.js';
import AbstractView from '../framework/view/abstract-view.js';
import { sortPoints } from '../utils/sort.js';

const MULTIPLE_SYMBOL = '...';
const MAX_CITIES_VISIBLE_COUNT = 3;

const createTripRouteTemplate = (pointsSort, destinations) => {
  const routeCities = [];
  pointsSort.forEach((point) => {
    const getPointDestination = destinations.find((item) => point.destination === item.id);
    routeCities.push(getPointDestination.name);
  });
  const startPoint = routeCities[0];
  const endPoint = routeCities.at(-1);
  let middlePoint = routeCities[1];
  let routeTitle = '';

  if (routeCities.length > MAX_CITIES_VISIBLE_COUNT) {
    middlePoint = MULTIPLE_SYMBOL;
  }

  switch (routeCities.length) {
    case 1:
      routeTitle = startPoint;
      break;
    case 2:
      routeTitle = `${startPoint} &mdash; ${endPoint}`;
      break;
    default:
      routeTitle = `${startPoint} &mdash; ${middlePoint} &mdash; ${endPoint}`;
  }

  if (!routeCities.length) {
    routeTitle = '';
  }

  return `${routeTitle !== '' ? `<h1 class="trip-info__title">${routeTitle}</h1>` : ''}`;
};

const createTripInfoDatesTemplate = (pointFormat) => {
  if (!pointFormat.length) {
    return '';
  }
  const startDate = appDay(pointFormat[0].dateFrom).format('DD MMM');
  const endDate = appDay(pointFormat[pointFormat.length - 1].dateTo).format('DD MMM');

  return `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${endDate}</p>`;
};

const createTripTotalPriceTemplate = (points, offers) => {
  let totalPrice = 0;
  points.forEach((point) => {
    totalPrice += +point.basePrice;

    const pointTypeOffer = offers.find((offer) => offer.type === point.type);
    if (!pointTypeOffer) {
      return;
    }

    const selectedOffers = pointTypeOffer.offers.filter((offer) => point.offers.includes(offer.id));
    selectedOffers.forEach((offer) => {
      totalPrice += +offer.price;
    });
  });

  return `<p class="trip-info__cost">${totalPrice !== 0 ? `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>` : ''}</p>`;
};


const createTripInfoTemplate = (points, offers, destinations) => {
  const pointsSort = sortPoints('day', points);


  return `<section class="trip-main__trip-info trip-info">
      <div class="trip-info__main">
        ${createTripRouteTemplate(pointsSort, destinations)}
        ${createTripInfoDatesTemplate(pointsSort)}
      </div>
            ${createTripTotalPriceTemplate(points, offers)}
          </section>`;
};

export default class TripInfo extends AbstractView {
  #points = null;
  #offers = null;
  #destinations = null;

  constructor(points, offers, destinations) {
    super();

    this.#points = points;
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#offers, this.#destinations);
  }
}
