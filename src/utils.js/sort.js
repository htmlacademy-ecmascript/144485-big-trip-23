
import dayjs from 'dayjs';

export const SORT_TYPE = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};


export const sortByDay = (pointA, pointB) => dayjs(pointA.dateTo).diff(dayjs(pointB.dateFrom));

export const sortByTime = (pointA, pointB) => dayjs(pointB.dateTo).diff(pointB.dateFrom) - dayjs(pointA.dateTo).diff(pointA.dateFrom);

export const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;
