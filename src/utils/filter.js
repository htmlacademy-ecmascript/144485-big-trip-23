import { appDay } from './day.js';

const isFutureEvent = (dateFrom) => appDay(dateFrom).isAfter(appDay());
const isPresentEvent = (dateFrom, dateTo) => appDay(dateFrom).isBefore(appDay()) && appDay(dateTo).isAfter(appDay());
const isPastEvent = (dateTo) => appDay(dateTo).isBefore(appDay());

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastEvent(point.dateTo)),
};

export const tripMessagesEmpty = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};

export { filter, FilterType };
