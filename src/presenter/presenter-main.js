import { render, RenderPosition, remove } from '../framework/render.js';
import SortPanel from '../view/sort-panel.js';
import WaypointList from '../view/waypoint-list.js';
import PresenterWaypoint from './presenter-waypoint.js';
import ListEmpty from '../view/list-empty.js';
import PresenterNewPoint from './presenter-new-point.js';
import { sortByDay, sortByTime, sortByPrice, SORT_TYPE } from '../utils/sort.js';
import { UserAction, UpdateType } from '../utils/const.js';
import { filter } from '../utils/filter.js';
import { FilterType } from '../utils/filter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorView from '../view/error-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class PresenterMain {
  #sortPanel = null;
  #tripInfo = null;
  #waypointList = new WaypointList();
  #pointsModel = null;
  #pointPresenterMap = new Map();
  #currentSortType = SORT_TYPE.DAY;
  #filterModel = null;
  #listMessageComponent = null;
  #tripEventsElement = null;
  #presenterNewPoint = null;
  #offers = null;
  #isLoading = true;
  #tripMainElement = null;
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #sortRendered = false;
  #errorComponent = new ErrorView();
  #pointPresenter = null;

  constructor({ pointsModel, filterModel, onNewPointDestroy }) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offers = pointsModel.offers;
    this.pageHeaderElement = document.querySelector('.page-header');
    this.#tripMainElement = this.pageHeaderElement.querySelector('.trip-main');
    this.pageMainElement = document.querySelector('.page-main');
    this.#tripEventsElement = this.pageMainElement.querySelector('.trip-events');
    this.#pointsModel.addObserver(this.#handlerModelEvent);
    this.#filterModel.addObserver(this.#handlerModelEvent);

    this.#presenterNewPoint = new PresenterNewPoint({
      pointsModel: this.#pointsModel,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      containerList: this.#waypointList.element,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange,
      onDestroy: () => {
        onNewPointDestroy();
        render(this.#waypointList, this.#tripEventsElement);
        this.#renderWaypointList();
      }
    });
  }

  get points() {
    const currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.events;
    const filteredPoints = filter[currentFilterType](points);
    switch (this.#currentSortType) {
      case SORT_TYPE.PRICE:
        return filteredPoints.sort(sortByPrice);
      case SORT_TYPE.TIME:
        return filteredPoints.sort(sortByTime);
    }
    return filteredPoints.sort(sortByDay);
  }

  createPoint() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    remove(this.#listMessageComponent);
    this.#presenterNewPoint.init();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        try {
          this.#pointPresenterMap.get(update.id).setSaving();
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenterMap.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        try {
          this.#presenterNewPoint.setSaving();
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#presenterNewPoint.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenterMap.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenterMap.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderWaypointList();
        break;
    }
  };

  #renderLoadingMessage() {
    render(this.#loadingComponent, this.#tripEventsElement);
  }


  #renderErrorMessage() {
    render(this.#errorComponent, this.#tripEventsElement);
  }


  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;

    this.#clearPoinsList();
    this.#renderWaypointList();
  };

  #renderSortPanel() {
    if (this.#sortRendered) {
      return;
    }
    this.#sortPanel = new SortPanel({
      onSortTypeChange: this.#onSortTypeChange,
      currentSortType: this.#currentSortType,
    });
    render(this.#sortPanel, this.#tripEventsElement, RenderPosition.AFTERBEGIN);
    this.#sortRendered = true;
  }

  #listEmptyMessage() {
    this.#listMessageComponent = new ListEmpty(this.#filterModel.filter);
    render(this.#listMessageComponent, this.#tripEventsElement);
  }

  #clearPoinsList(resetSortType = false) {
    this.#presenterNewPoint.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();

    remove(this.#sortPanel);
    this.#sortRendered = false;
    remove(this.#loadingComponent);
    remove(this.#listMessageComponent);
    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
    }
  }

  #renderWaypoints() {
    const trip = document.querySelector('.trip-events__list');
    trip.innerHTML = '';
    this.points.forEach((point) => this.#renderWaypoint(point));
  }

  #renderWaypoint = (point) => {
    this.#pointPresenter = new PresenterWaypoint({
      pointsModel: this.#pointsModel,
      pointListContainer: this.#waypointList.element,
      destinationCurrent: this.#pointsModel.getDestinationId(point.destination),
      offers: this.#offers,
      offersCurrent: this.#pointsModel.getCurrentOffer(point.type),
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange,
    });
    this.#pointPresenter.init(point);
    this.#pointPresenterMap.set(point.id, this.#pointPresenter);
  };

  #renderWaypointList = () => {
    // remove(this.#waypointList);
    render(this.#waypointList, this.#tripEventsElement);

    if (this.#isLoading) {
      this.#renderLoadingMessage();
      return;
    }

    if (!this.points.length && !this.#pointsModel.offers.length && !this.#pointsModel.destinations.length) {
      this.#renderErrorMessage();
      remove(this.#sortPanel);
      return;
    }


    if (this.points.length) {
      this.#renderSortPanel();
      remove(this.#loadingComponent);
      this.#renderWaypoints();
    } else {
      this.#listEmptyMessage();
      remove(this.#sortPanel);
    }
  };

  #onModeChange = () => {
    this.#presenterNewPoint.destroy();
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  init() {
    this.#renderWaypointList();
  }
}
