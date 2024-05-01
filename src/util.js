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


export { createId, getRandomInteger, getRandomArrayElement };
