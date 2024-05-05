import { getRandomArrayElement, createId, getRandomInt } from '../util.js';
import { EVENT_TYPES } from './variablies.js';


const OFFER_TITLES = ['Order meal', 'Infotainment system', 'Choose seats', 'Book a taxi at the arrival point', 'Wake up at a certain time'];

const createOfferId = createId();

const createOffer = () => ({
  id: `${createOfferId()}`,
  title: getRandomArrayElement(OFFER_TITLES),
  price: getRandomInt(500)
});

const offers = EVENT_TYPES.map((item) => ({
  type: item,
  offer: Array.from({ length: getRandomInt(6) }, createOffer)
}));

export const createRandomOffers = () => offers;
// export const createRandomOffer = () => getRandomArrayElement(offers);

