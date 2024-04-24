import EventButton from './view/creation-form.js';
import FilterControlPanel from './view/filter.js';
import SortPanel from './view/sorting.js';
import TripInfo from './view/trip-info.js';
import { render, RenderPosition } from './render.js';

const pageHeaderElement = document.querySelector('.page-header');
const tripMainElement = pageHeaderElement.querySelector('.trip-main');
const tripControlsFiltersElement = pageHeaderElement.querySelector('.trip-controls__filters');

const pageMainElement = document.querySelector('.page-main');
const tripSortElement = pageMainElement.querySelector('.trip-events');

render(new EventButton(), tripMainElement);
render(new FilterControlPanel(), tripControlsFiltersElement);
render(new SortPanel(), tripSortElement);
render(new TripInfo(), tripMainElement, RenderPosition.AFTERBEGIN);
