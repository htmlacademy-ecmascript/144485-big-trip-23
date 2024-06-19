import { appDay } from './day.js';

export const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const getTimeDifferens = ({ dateFrom, dateTo }) => new Date(dateTo).getTime() - new Date(dateFrom).getTime();

const sortPointBy = {
  [SORT_TYPE.DAY]: (points) => points.toSorted((a, b) => appDay(a.dateFrom).diff(b.dateFrom)),
  [SORT_TYPE.TIME]: (points) => points.toSorted((a, b) => getTimeDifferens(b) - getTimeDifferens(a)),
  [SORT_TYPE.PRICE]: (points) => points.toSorted((a, b) => b.basePrice - a.basePrice),
};

export const sortPoints = (sortType, points) => sortPointBy[sortType](points);
