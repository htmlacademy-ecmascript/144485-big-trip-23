import { createRandomOffers } from './offer-mock.js';
import { destinationCreate } from './destination.js';
import { createId, getRandomInteger, getRandomInt, generateDates, getRandomArrayElement } from '../util.js';
import { EVENT_TYPES } from './variablies.js';

const idTripEvent = createId();
const EVENT_COUNT = 3;

const generateTripEvent = () => {
  const dates = generateDates();
  const { id: destinationId } = destinationCreate();
  const typeRandom = getRandomArrayElement(EVENT_TYPES);
  const randomOffers = createRandomOffers();
  const getOffers = randomOffers.find((element) => element.type === typeRandom);
  const getOffersId = getOffers.offer.map((item) => item.id).slice(0, 3);

  return {
    id: idTripEvent(),
    basePrice: getRandomInt(100),
    ...dates,
    destination: destinationId,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getOffersId,
    type: typeRandom,
  };
};

const MOCKED_EVENTS = Array.from({ length: EVENT_COUNT }, generateTripEvent);


export { MOCKED_EVENTS };
