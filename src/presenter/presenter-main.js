import { render, RenderPosition, remove } from '../framework/render.js';
import SortPanel from '../view/sort-panel.js';
import WaypointList from '../view/waypoint-list.js';
import PresenterWaypoint from './presenter-waypoint.js';
import ListEmpty from '../view/list-empty.js';
import PresenterNewPoint from './presenter-new-point.js';
import { SORT_TYPE, sortPoints } from '../utils/sort.js';
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
  #currentFilterType = FilterType.EVERYTHING;
  #waypointList = new WaypointList();
  #pointsModel = null;
  #pointPresenterItems = new Map();
  #currentSortType = SORT_TYPE.DAY;
  #filterModel = null;
  #listMessageComponent = null;
  #tripEventsElement = null;
  #presenterNewPoint = null;
  #offers = null;
  #isLoading = true;
  #loadingComponent = new LoadingView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT,
  });

  #sortRendered = false;
  #errorComponent = new ErrorView();
  #pointPresenter = null;
  #newPointButtonComponent = null;

  constructor({ pointsModel, filterModel, onNewPointDestroy, newPointButtonComponent }) {
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#offers = pointsModel.offers;
    this.pageHeaderElement = document.querySelector('.page-header');
    this.pageMainElement = document.querySelector('.page-main');
    this.#tripEventsElement = this.pageMainElement.querySelector('.trip-events');
    this.#pointsModel.addObserver(this.#handlerModelEvent);
    this.#filterModel.addObserver(this.#handlerModelEvent);
    this.#newPointButtonComponent = newPointButtonComponent;

    this.#presenterNewPoint = new PresenterNewPoint({
      pointsModel: this.#pointsModel,
      destinations: this.#pointsModel.destinations,
      offers: this.#pointsModel.offers,
      containerList: this.#waypointList.element,
      onPointChange: this.#handleViewAction,
      onModeChange: this.#onModeChange,
      deletingEmptyPoint: this.#deletingEmptyPoint,
      recoveryEmptyPoint: this.#recoveryEmptyPoint,
      onDestroy: () => {
        onNewPointDestroy();
      }
    });
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.events;
    const filteredPoints = filter[this.#currentFilterType](points);
    return sortPoints(this.#currentSortType, filteredPoints);
  }

  createPoint() {
    this.#currentSortType = SORT_TYPE.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#presenterNewPoint.init();
  }

  init() {
    this.#renderWaypointList();
  }

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:

        try {
          this.#pointPresenterItems.get(update.id).setSaving();
          await this.#pointsModel.updatePoint(updateType, update);

        } catch (error) {
          this.#pointPresenterItems.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        try {
          this.#presenterNewPoint.setSaving();
          await this.#pointsModel.addPoint(updateType, update);
        } catch (error) {
          this.#presenterNewPoint.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenterItems.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (error) {
          this.#pointPresenterItems.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handlerModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenterItems.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointsList();
        this.#renderWaypointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointsList({ resetSortType: true });
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
    this.#clearPointsList();
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

  #clearPointsList(resetSortType = false) {
    this.#presenterNewPoint.destroy();
    this.#pointPresenterItems.forEach((presenter) => presenter.destroy());
    this.#pointPresenterItems.clear();
    remove(this.#sortPanel);
    this.#sortRendered = false;
    remove(this.#loadingComponent);
    remove(this.#listMessageComponent);
    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DAY;
      this.#currentFilterType = FilterType.EVERYTHING;
    }
  }

  #renderWaypoints() {
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
    this.#pointPresenterItems.set(point.id, this.#pointPresenter);
  };

  #disabledNewPoint = () => {
    this.#newPointButtonComponent.element.disabled = true;
  };

  #enabledNewPoint = () => {
    this.#newPointButtonComponent.element.disabled = false;
  };


  #renderWaypointList = () => {
    render(this.#waypointList, this.#tripEventsElement);

    if (this.#isLoading) {
      this.#renderLoadingMessage();
      this.#disabledNewPoint();
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
      this.#enabledNewPoint();
      this.#renderWaypoints();
    } else {
      this.#listEmptyMessage();
      remove(this.#sortPanel);
    }
  };

  #onModeChange = () => {
    this.#presenterNewPoint.destroy();
    this.#pointPresenterItems.forEach((presenter) => presenter.resetView());
  };

  #deletingEmptyPoint = () => {
    if (this.#listMessageComponent) {
      remove(this.#listMessageComponent);
      this.#listMessageComponent = null;
    }
  };

  #recoveryEmptyPoint = () => {
    if (!this.#listMessageComponent && this.#pointsModel.events.length === 0) {
      this.#listEmptyMessage();
    }
  };
}
