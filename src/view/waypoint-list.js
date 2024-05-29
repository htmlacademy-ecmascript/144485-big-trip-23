import AbstractView from '../framework/view/abstract-view.js';

const createWaypointList = () => '<ul class="trip-events__list"></ul>';

export default class WaypointList extends AbstractView {

  constructor() {
    super();
  }

  get template() {
    return createWaypointList();
  }
}
