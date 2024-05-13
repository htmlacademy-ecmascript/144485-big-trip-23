import { MOCKED_EVENTS } from '../mock/trip-event.js';

export default class PointsModel {
  constructor() {
    this.tripEventAll = MOCKED_EVENTS;
  }

  getEvent() {
    return this.tripEventAll;
  }
}
