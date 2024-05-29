import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import { generateFilter } from './mock/filter.js';
import { render } from './framework/render.js';
import Filter from './view/filter.js';

const filterContainer = document.querySelector('.trip-controls__filters');

const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filters = generateFilter(pointsModel.event);


const presenter = new Presenter({
  pointsModel,
  destinationsModel,
  offersModel
});


render(new Filter({ filters }), filterContainer);
presenter.init();
