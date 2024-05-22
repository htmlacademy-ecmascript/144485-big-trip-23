import { render, replace } from '../framework/render.js';
import Waypoint from '../view/waypoint.js';
import WaypointEdit from '../view/waypoint-edit.js';

export default class PresenterWaypoint {
  #pointsModelAll = null;
  #destinationAll = null;
  #pageMainElement;
  constructor({ pointsModel }) {
    this.#pointsModelAll = pointsModel.event;
    this.#destinationAll = pointsModel.destinationAll;
    this.#pageMainElement = document.querySelector('.page-main');

  }

  renderWaypoints() {
    this.#pointsModelAll.forEach((element) => this.renderWaypoint(element));
  }

  renderWaypoint(element) {
    const tripEventsListElement = this.#pageMainElement.querySelector('.trip-events__list');
    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        switchToViewMode();
      }
    };
    const onClickButton = () => switchToEditMode();
    const onClickButtonCansel = () => switchToViewMode();

    const eventView = new Waypoint({
      waypoint: element,
      onClickButton: onClickButton,


    });

    const eventEditView = new WaypointEdit({
      waypoint: element,
      onClickButtonCansel: onClickButtonCansel,

    });

    function switchToEditMode() {
      replace(eventEditView, eventView);
      document.addEventListener('keydown', onEscKeydown);
    }

    function switchToViewMode() {
      replace(eventView, eventEditView);
      document.removeEventListener('keydown', onEscKeydown);

    }

    render(eventView, tripEventsListElement);
  }


  init() {
    this.renderWaypoints();
  }
}
