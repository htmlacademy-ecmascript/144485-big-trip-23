import dayjs from 'dayjs';
import AbstractView from '../framework/view/abstract-view.js';

const DATE_FORMAT = 'MMM DD';
const MULTIPLE_SYMBOL = '...';
const MAX_CITIES_VISIBLE_COUNT = 3;

const createTripInfoTemplate = (points, offers, destinations) => {
  const createTripRouteTemplate = () => {
    const routeCities = [];
    points.forEach((point) => {
      const getPointDestination = destinations.find((item) => point.destination === item.id);
      routeCities.push(getPointDestination.name);
    });
    const startPoint = routeCities[0];
    const endPoint = routeCities.at(-1);
    let middlePoint = routeCities[1];
    let routeString = '';

    if (routeCities.length > MAX_CITIES_VISIBLE_COUNT) {
      middlePoint = MULTIPLE_SYMBOL;
    }

    switch (routeCities.length) {
      case 1:
        routeString = startPoint;
        break;
      case 2:
        routeString = `${startPoint} &mdash; ${endPoint}`;
        break;
      default:
        routeString = `${startPoint} &mdash; ${middlePoint} &mdash; ${endPoint}`;
    }

    if (!routeCities.length) {
      routeString = 'No events';
    }

    return `<h1 class="trip-info__title">
            ${routeString}
          </h1>`;
  };

  const createTripInfoDatesTemplate = () => {
    if (!points.length) {
      return '';
    }

    const startDate = dayjs(points[0].dateFrom);
    const endDate = dayjs(points.at(-1).dateTo);

    let endDateFormat = DATE_FORMAT;

    if (endDate.isSame(startDate, 'month')) {
      endDateFormat = 'DD';
    }

    return `<p class="trip-info__dates">${startDate.format(DATE_FORMAT)}&nbsp;&mdash;&nbsp;${endDate.format(endDateFormat)}</p>`;
  };

  const createTripTotalPriceTemplate = () => {
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

    return `<p class="trip-info__cost">Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span></p>`;
  };

  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              ${createTripRouteTemplate()}
              ${createTripInfoDatesTemplate()}
            </div>
            ${createTripTotalPriceTemplate()}
          </section>`;
};

export default class TripInfoView extends AbstractView {
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
