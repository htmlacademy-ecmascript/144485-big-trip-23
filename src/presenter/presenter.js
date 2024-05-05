import { render, RenderPosition } from '../render.js';
import CreationForm from '../view/creation-form.js';
import Filter from '../view/filter.js';
import SortPanel from '../view/sort-panel.js';
import TripInfo from '../view/trip-info.js';
import WaypointList from '../view/waypoint-list.js';
import Waypoint from '../view/waypoint.js';
import WaypointForm from '../view/waypoint-form.js';

export default class Presenter {
  constructor({ pointsModel }) {
    this.pointsModel = pointsModel;
    this.pointsModelAll = [...this.pointsModel.getEvent()];
    this.pageHeaderElement = document.querySelector('.page-header');
    this.tripMainElement = this.pageHeaderElement.querySelector('.trip-main');
    this.tripControlsFiltersElement = this.pageHeaderElement.querySelector('.trip-controls__filters');
    this.pageMainElement = document.querySelector('.page-main');
    this.tripEventsElement = this.pageMainElement.querySelector('.trip-events');
  }

  renderCreationform() {
    render(new CreationForm(), this.tripMainElement);
  }

  renderFilter() {
    render(new Filter(), this.tripControlsFiltersElement);
  }

  renderSortPanel() {
    render(new SortPanel(), this.tripEventsElement);
  }

  renderTripInfo() {
    render(new TripInfo(), this.tripMainElement, RenderPosition.AFTERBEGIN);
  }

  renderWaypointList() {
    render(new WaypointList(), this.tripEventsElement);
  }

  renderWaypointForm() {
    const tripEventsListElement = this.pageMainElement.querySelector('.trip-events__list');
    render(new WaypointForm({ waypoint: this.pointsModelAll[0] }), tripEventsListElement, RenderPosition.AFTERBEGIN);
  }

  renderWaypoint() {
    const tripEventsListElement = this.pageMainElement.querySelector('.trip-events__list');
    for (const point of this.pointsModelAll) {
      render(new Waypoint({ waypoint: point }), tripEventsListElement);
    }
  }

  init() {
    this.renderCreationform();
    this.renderFilter();
    this.renderSortPanel();
    this.renderTripInfo();
    this.renderWaypointList();
    this.renderWaypointForm();
    this.renderWaypoint();
  }
}
