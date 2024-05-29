import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/IsSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/IsSameOrBefore.js';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);


const isFutureEvent = (dateFrom) => dayjs(dateFrom).isAfter(dayjs());
const isPresentEvent = (dateFrom, dateTo) => dayjs(dateFrom).isSameOrBefore(dayjs()) && dayjs(dateTo).isSameOrAfter(dayjs());
const isPastEvent = (dateTo) => dayjs(dateTo).isSameOrBefore(dayjs());

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isFutureEvent(point.dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentEvent(point.dateFrom, point.dateTo)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastEvent(point.dateTo))
};

export const TripMessagesEmpty = {
  [FilterType.EVERYTHING]: 'Click  New Event to create first point',
  [FilterType.FUTURE]: 'There are no future events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.PAST]: 'There are no past events now',
};


export { filter };
