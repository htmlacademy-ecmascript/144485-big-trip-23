import { appDay } from './day.js';

export const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const sortByDay = (pointA, pointB) => appDay(pointA.dateTo).diff(appDay(pointB.dateFrom));

export const sortByTime = (pointA, pointB) => appDay(pointB.dateTo).diff(pointB.dateFrom) - appDay(pointA.dateTo).diff(pointA.dateFrom);

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
