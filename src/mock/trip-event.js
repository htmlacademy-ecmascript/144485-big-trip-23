import { createRandomOffers } from './offer-mock.js';
import { destinationCreate } from './destination.js';
import { getRandomInt, generateDates, getRandomArrayElement } from '../utils.js/util.js';
import { EVENT_TYPES } from './variablies.js';

const EVENT_COUNT = 3;

const generateTripEvent = () => {
  const dates = generateDates();
  const { id: destinationId } = destinationCreate();
  const typeRandom = getRandomArrayElement(EVENT_TYPES);
  const randomOffers = createRandomOffers();
  const getOffers = randomOffers.find((element) => element.type === typeRandom);
  const getOffersId = getOffers.offer.map((item) => item.id);

  return {
    id: crypto.randomUUID(),
    basePrice: getRandomInt(100),
    ...dates,
    destination: destinationId,
    isFavorite: false,
    offers: getOffersId,
    type: typeRandom,
  };
};

const MOCKED_EVENTS = Array.from({ length: EVENT_COUNT }, generateTripEvent);

export { MOCKED_EVENTS };
