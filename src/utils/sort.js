import { appDay } from './day.js';

export const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

const getTimeDifferens = ({ dateFrom, dateTo }) => new Date(dateTo).getTime() - new Date(dateFrom).getTime();

const sortPointBy = {
  [SORT_TYPE.DAY]: (points) => points.toSorted((pointA, pointB) => appDay(pointA.dateFrom).diff(pointB.dateFrom)),
  [SORT_TYPE.TIME]: (points) => points.toSorted((pointA, pointB) => getTimeDifferens(pointB) - getTimeDifferens(pointA)),
  [SORT_TYPE.PRICE]: (points) => points.toSorted((pointA, pointB) => pointB.basePrice - pointA.basePrice),
};

export const sortPoints = (sortType, points) => sortPointBy[sortType](points);
