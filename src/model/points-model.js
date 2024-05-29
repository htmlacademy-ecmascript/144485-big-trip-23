import { MOCKED_EVENTS } from '../mock/trip-event.js';

export default class PointsModel {
  #tripEventAll = null;
  constructor() {
    this.#tripEventAll = MOCKED_EVENTS;
  }

  get event() {
    return this.#tripEventAll;
  }
}
