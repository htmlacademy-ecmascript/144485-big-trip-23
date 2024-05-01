import dayjs from 'dayjs';
import { EVENTTYPES } from './event-types.js';
import { LOCATIONS } from './locations.js';
import { createId, getRandomInteger, getRandomArrayElement } from '../util.js';


const generateDates = () => {
  const maxGap = 14;

  const startDate = dayjs()
    .add(getRandomInteger(-maxGap, maxGap), 'day')
    .add(getRandomInteger(-maxGap, maxGap), 'hour')
    .add(getRandomInteger(-maxGap, maxGap), 'minute');

  const endDay = startDate
    .clone()
    .add(getRandomInteger(0, maxGap), 'day')
    .add(getRandomInteger(0, 59), 'hour')
    .add(getRandomInteger(0, 59), 'minute');

  return {
    start: startDate.toISOString(),
    end: endDay.toISOString()
  };
};

const generateTripEvent = () => {
  const dates = generateDates();
  const eventRandom = getRandomArrayElement(EVENTTYPES);
  const locationsRandom = getRandomArrayElement(LOCATIONS);
  const generatePrice = () => getRandomInteger(1, 100) * 10;
  const idTripEvent = createId();


  return {
    id: idTripEvent(),
    basePrice: generatePrice(),
    dateFrom: dates.start,
    dateTo: dates.end,
    destination: locationsRandom,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    events: eventRandom,
    type: eventRandom.type
  };
};

export { generateTripEvent };
