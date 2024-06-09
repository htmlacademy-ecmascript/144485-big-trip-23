import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
// import DestinationsModel from './model/destinations-model.js';
// import OffersModel from './model/offers-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/presenter-filter.js';
import PointsApiService from './points-api-service.js';
// import CreationForm from './view/creation-form.js';

const filterContainer = document.querySelector('.trip-controls__filters');

const AUTHORIZATION = 'Basic hf7898sdfscv89';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';


const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
// const destinationsModel = new DestinationsModel();
// const offersModel = new OffersModel();
const filterModel = new FilterModel();

const presenter = new Presenter({
  pointsModel,
  filterModel,

});


const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel
});


presenter.init();
filterPresenter.init();
pointsModel.init();
// .finally(() => {
//   if (pointsModel.event.length) {
//     CreationForm.element.disabled = false;
//   }
// });
