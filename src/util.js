import dayjs from 'dayjs';

const createId = () => {
  let count = 0;
  return function () {
    count += 1;
    return count;
  };
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getRandomInt = (max) => Math.round(Math.random() * max);

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
    dateFrom: startDate.toISOString(),
    dateTo: endDay.toISOString(),
  };
};

export { createId, getRandomInteger, getRandomArrayElement, getRandomInt, generateDates };
