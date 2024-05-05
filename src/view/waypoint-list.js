import { createElement } from '../render.js';

const createWaypointList = () => '<ul class="trip-events__list"></ul>';

export default class WaypointList {
  getTemplate() {
    return createWaypointList();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
