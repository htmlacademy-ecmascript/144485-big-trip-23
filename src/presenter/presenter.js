import { render, RenderPosition, remove } from '../framework/render.js';
import CreationForm from '../view/creation-form.js';
import SortPanel from '../view/sort-panel.js';
import TripInfo from '../view/trip-info.js';
import WaypointList from '../view/waypoint-list.js';
import PresenterWaypoint from './presenter-waypoint.js';
import ListEmpty from '../view/list-empty.js';
import PresenterNewPoint from './presenter-new-point.js';
import { SORT_TYPE } from '../utils.js/sort.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils.js/sort.js';
import { UserAction, UpdateType } from '../utils.js/const.js';
import { filter } from '../utils.js/filter.js';
import { FilterType } from '../utils.js/filter.js';

export default class Presenter {
  #creationForm = null;
  #sortPanel = null;
  #tripInfo = new TripInfo();
  #waypointList = new WaypointList();
  #listEmpty = null;
  #destinationsModel;
  #pointsModel = null;
  #pointPresenterMap = new Map();
  #currentSortType = null;
  #filterModel = null;
  #listMessageComponent = null;
  #tripEventsElement = null;
  #presenterNewPoint = null;
  #offersModel = null;

  constructor({ pointsModel, destinationsModel, offersModel, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#filterModel = filterModel;
    this.pageHeaderElement = document.querySelector('.page-header');
    this.tripMainElement = this.pageHeaderElement.querySelector('.trip-main');
    this.pageMainElement = document.querySelector('.page-main');
    this.#tripEventsElement = this.pageMainElement.querySelector('.trip-events');
    this.#pointsModel.addObserver(this.#handlerModelEvent);
    this.#filterModel.addObserver(this.#handlerModelEvent);

    this.#presenterNewPoint = new PresenterNewPoint({
      offersModel: this.#offersModel,
      destinationsModel: this.#destinationsModel,
      containerList: this.#waypointList.element,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange,
      handleDestroy: this.#handleNewPointButtonClose
    });
  }

  get points() {
    const currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.event;
    const filteredPoints = filter[currentFilterType](points);
    switch (this.#currentSortType) {
      case SORT_TYPE.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SORT_TYPE.TIME:
        return filteredPoints.sort(sortByTime);
      case SORT_TYPE.DAY:
        return filteredPoints.sort(sortByDay);
    }
    return filteredPoints;
  }


  createPoint() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#presenterNewPoint.init();
  }


  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }

  };

  #handlerModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoinsList();
        this.#renderWaypointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPoinsList({ resetSortType: true });
        this.#renderWaypointList();
        break;
    }

  };

  #renderCreationform() {
    this.#creationForm = new CreationForm({
      onClick: this.#handleNewPointButtonClick
    });
    render(this.#creationForm, this.tripMainElement);
  }

  #handleNewPointButtonClose = () => {
    this.#creationForm.element.disabled = false;
  };


  #handleNewPointButtonClick = () => {
    this.createPoint();
    this.#creationForm.element.disabled = true;
  };


  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoinsList();
    this.#renderWaypointList();
  };

  #renderSortPanel() {
    this.#sortPanel = new SortPanel({
      onSortTypeChange: this.#onSortTypeChange,
    });
    render(this.#sortPanel, this.#tripEventsElement);

  }

  #clearPoinsList(resetSortType = false) {
    this.#presenterNewPoint.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();

    remove(this.#listMessageComponent);

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  }

  #renderTripInfo() {
    render(this.#tripInfo, this.tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #listEmptyMessage() {
    this.#listMessageComponent = new ListEmpty(this.#filterModel.filter);

    render(this.#listMessageComponent, this.#tripEventsElement);
  }

  #renderWaypoints() {
    this.points.forEach((point) => this.#renderWaypoint(point));
  }

  #renderWaypoint = (point) => {
    const pointPresenter = new PresenterWaypoint({
      pointListContainer: this.#waypointList.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.#offersModel,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenterMap.set(point.id, pointPresenter);
  };


  #renderWaypointList = () => {
    render(this.#waypointList, this.#tripEventsElement);

    if (this.points.length) {
      remove(this.#listMessageComponent);
      this.#renderWaypoints();
    } else {
      remove(this.#sortPanel);
      this.#listEmptyMessage();
    }
  };


  #onModeChange = () => {
    this.#presenterNewPoint.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  init() {
    this.#renderCreationform();
    this.#renderSortPanel();
    this.#renderTripInfo();
    this.#renderWaypointList();
  }
}
