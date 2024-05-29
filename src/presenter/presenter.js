import { render, RenderPosition } from '../framework/render.js';
import CreationForm from '../view/creation-form.js';
import SortPanel from '../view/sort-panel.js';
import TripInfo from '../view/trip-info.js';
import WaypointList from '../view/waypoint-list.js';
import PresenterWaypoint from './presenter-waypoint.js';
import ListEmpty from '../view/list-empty.js';
import { updateDate } from '../utils.js/util.js';
import { SORT_TYPE } from '../utils.js/sort.js';
import { sortByDay, sortByTime, sortByPrice } from '../utils.js/sort.js';

export default class Presenter {
  #creationForm = new CreationForm();
  #sortPanel = null;
  #tripInfo = new TripInfo();
  #waypointList = new WaypointList();
  #listEmpty = new ListEmpty();
  #destinationsModel;
  #pointsModel;
  #pointsModelAll = [];
  #pointPresenterMap = new Map();
  #currentSortType = null;
  #sourcedPoints = [];

  constructor({ pointsModel, destinationsModel, offersModel }) {
    this.#pointsModel = pointsModel;
    this.#pointsModelAll = [...this.#pointsModel.event];
    this.#sourcedPoints = [...this.#pointsModel.event];
    this.#destinationsModel = destinationsModel;
    this.offersModel = offersModel;
    this.pageHeaderElement = document.querySelector('.page-header');
    this.tripMainElement = this.pageHeaderElement.querySelector('.trip-main');
    this.pageMainElement = document.querySelector('.page-main');
    this.tripEventsElement = this.pageMainElement.querySelector('.trip-events');
  }

  #renderCreationform() {
    render(this.#creationForm, this.tripMainElement);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SORT_TYPE.PRICE:
        this.#pointsModelAll.sort(sortByPrice);
        break;
      case SORT_TYPE.TIME:
        this.#pointsModelAll.sort(sortByTime);
        break;
      case SORT_TYPE.DAY:
        this.#pointsModelAll.sort(sortByDay);
        break;

      default:
        this.#pointsModelAll();
    }
  };

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortPoints(sortType);
    this.#clearPoinsList();
    this.#renderWaypointList();
  };

  #renderSortPanel() {
    this.#sortPanel = new SortPanel({
      onSortTypeChange: this.#onSortTypeChange,
    });
    render(this.#sortPanel, this.tripEventsElement);
  }

  #clearPoinsList() {
    this.#pointPresenterMap.forEach((presenter) => presenter.destroy());
    this.#pointPresenterMap.clear();
  }

  #renderTripInfo() {
    render(this.#tripInfo, this.tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #listEmptyMessage() {
    render(this.#listEmpty, this.tripEventsElement);
  }

  #renderWaypoints() {
    this.#pointsModelAll.forEach((point) => this.#renderWaypoint(point));
  }

  #renderWaypoint(point) {
    const pointPresenter = new PresenterWaypoint({
      pointListContainer: this.#waypointList.element,
      destinationsModel: this.#destinationsModel,
      offersModel: this.offersModel,
      onPointChange: this.#onPointChange,
      onModeChange: this.#onModeChange,
    });
    pointPresenter.init(point);
    this.#pointPresenterMap.set(point.id, pointPresenter);
  }

  #renderWaypointList() {
    render(this.#waypointList, this.tripEventsElement);

    if (this.#pointsModelAll.length) {
      this.#renderWaypoints();
    } else {
      this.#listEmptyMessage();
    }
  }

  #onPointChange = (updatePoint) => {
    this.#pointsModelAll = updateDate(this.#pointsModelAll, updatePoint);
    this.#sourcedPoints = updateDate(this.#sourcedPoints, updatePoint);
    this.#pointPresenterMap.get(updatePoint.id).init(updatePoint);
  };

  #onModeChange = () => {
    this.#pointPresenterMap.forEach((presenter) => presenter.resetView());
  };

  init() {
    this.#renderCreationform();
    this.#renderSortPanel();
    this.#renderTripInfo();
    this.#renderWaypointList();
  }
}
