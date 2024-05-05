import { generateTripEventArray } from '../mock/trip-event.js';

export default class PointsModel {
  constructor() {
    this.tripEventAll = generateTripEventArray;
  }

  getEvent() {
    return this.tripEventAll;
  }
}
