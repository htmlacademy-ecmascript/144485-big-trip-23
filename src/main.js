import Presenter from './presenter/presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/presenter-filter.js';
import PointsApiService from './points-api-service.js';
// import CreationForm from './view/creation-form.js';

const filterContainer = document.querySelector('.trip-controls__filters');

const AUTHORIZATION = 'Basic hf7898sdfscv85';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';


const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
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
//     addPointButton.disabled = false;
//   }
// });
