import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
import DestinationsModel from './model/destinations-model.js';
import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/presenter-filter.js';

const filterContainer = document.querySelector('.trip-controls__filters');


const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel();
const offersModel = new OffersModel();
const filterModel = new FilterModel();


const presenter = new Presenter({
  pointsModel,
  destinationsModel,
  offersModel,
  filterModel,

});


const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel
});


presenter.init();
filterPresenter.init();
