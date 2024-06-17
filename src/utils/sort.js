import { appDay } from './day.js';

export const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const sortByDay = (pointA, pointB) => appDay(pointA.dateTo).diff(appDay(pointB.dateFrom));

export const sortByTime = (pointA, pointB) => appDay(pointB.dateTo).diff(pointB.dateFrom) - appDay(pointA.dateTo).diff(pointA.dateFrom);

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

const getTimeDifferens = ({ dateFrom, dateTo }) => new Date(dateTo).getTime() - new Date(dateFrom).getTime();

const sortPointBy = {
  [SORT_TYPE.DAY]: (points) => points.toSorted((a, b) => appDay(a.dateFrom).diff(b.dateFrom)),
  // [SORT_TYPE.EVENT]: (points, pointModel) =>
  //   points.toSorted((a, b) => {
  //     const eventNameA = `${a.type} ${pointModel.getDestinationById(a.destination)?.name}`;
  //     const eventNameB = `${b.type} ${pointModel.getDestinationById(b.destination)?.name}`;

  //     return eventNameA.localeCompare(eventNameB);
  //   }),
  [SORT_TYPE.TIME]: (points) => points.toSorted((a, b) => getTimeDifferens(b) - getTimeDifferens(a)),
  [SORT_TYPE.PRICE]: (points) => points.toSorted((a, b) => b.basePrice - a.basePrice),
};

export const sortPoints = (sortType, points, pointModel) => sortPointBy[sortType](points, pointModel);
