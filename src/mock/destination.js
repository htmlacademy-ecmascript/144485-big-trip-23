import { getRandomInt, getRandomArrayElement } from '../util.js';

const CITIES = ['Amsterdam', 'Chamonix', 'Geneva', 'Paris', 'Milano'];

const createDescription = () =>
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.';

const createPicture = (item) => ({
  src: `https://loremflickr.com/248/152?${getRandomInt(5)}`,
  description: `${item} Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
});

const destination = CITIES.map((item) => ({
  id: crypto.randomUUID(),
  name: item,
  description: createDescription(),
  pictures: Array.from({ length: getRandomInt(8) }, createPicture),
}));

export const destinationCreate = () => getRandomArrayElement(destination);
export const destinationCreateAll = () => destination;
