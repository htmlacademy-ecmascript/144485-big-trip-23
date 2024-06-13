import { appDay } from './day.js';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateDates = () => {
  const maxGap = 14;

  const startDate = appDay()
    .add(getRandomInteger(-maxGap, maxGap), 'day')
    .add(getRandomInteger(-maxGap, maxGap), 'hour')
    .add(getRandomInteger(-maxGap, maxGap), 'minute');

  const endDay = startDate
    .clone()
    .add(getRandomInteger(0, maxGap), 'day')
    .add(getRandomInteger(0, 59), 'hour')
    .add(getRandomInteger(0, 59), 'minute');

  return {
    dateFrom: startDate.toISOString(),
    dateTo: endDay.toISOString(),
  };
};

const getDuration = (beginISO, endISO) => {
  const getTimeDiff = () => {
    const startDate = appDay(beginISO).toDate();
    const endDate = appDay(endISO).toDate();
    const resultDict = new Date(endDate - startDate);

    return {
      days: resultDict.getUTCDate() - 1,
      hours: resultDict.getUTCHours(),
      minutes: resultDict.getUTCMinutes(),
    };
  };

  const timeDifference = getTimeDiff();
  const resultArray = [];

  if (timeDifference.days !== 0) {
    resultArray[0] = `${String(timeDifference.days).padStart(2, '0')}Day`;
  }
  if (timeDifference.hours !== 0) {
    resultArray[1] = `${String(timeDifference.hours).padStart(2, '0')}h`;
  }
  if (timeDifference.minutes !== 0) {
    resultArray[2] = `${String(timeDifference.minutes).padStart(2, '0')}m`;
  }

  return resultArray.join(' ');
};

const isEscapeKey = (evt) => evt.key === 'Escape';


const PRICE_FIELD_PATTERN = /\D+/;

const validatePriceField = (value) => {
  if (PRICE_FIELD_PATTERN.test(value)) {
    value = 0;
  }
  return +value;
};

export { getRandomInteger, generateDates, getDuration, isEscapeKey, validatePriceField };
