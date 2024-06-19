import PresenterMain from './presenter/presenter-main.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import FilterPresenter from './presenter/presenter-filter.js';
import PointsApiService from './points-api-service.js';
import PresenterInfoPanel from './presenter/presenter-info-panel.js';
import CreationForm from './view/creation-form.js';
import { render } from './framework/render.js';

const filterContainer = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');

const AUTHORIZATION = 'Basic hf7898sdfscv88';
const END_POINT = 'https://23.objects.htmlacademy.pro/big-trip';

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FilterModel();

const newPointButtonComponent = new CreationForm({
  onClick: handleNewPointButtonClick,
});

const presenter = new PresenterMain({
  pointsModel,
  filterModel,
  onNewPointDestroy: handleNewPointButtonClose,
  // newPointButtonComponent: newPointButtonComponent
});

const filterPresenter = new FilterPresenter({
  filterContainer: filterContainer,
  filterModel,
  pointsModel,
});

const presenterInfoPanel = new PresenterInfoPanel({
  tripInfoContainer: tripMainElement,
  pointsModel,
});

function handleNewPointButtonClick() {
  presenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

function handleNewPointButtonClose() {
  newPointButtonComponent.element.disabled = false;
}

render(newPointButtonComponent, tripMainElement);

newPointButtonComponent.element.disabled = true;

presenter.init();
filterPresenter.init();
pointsModel.init().finally(() => {
  newPointButtonComponent.element.disabled = false;
});
presenterInfoPanel.init();
