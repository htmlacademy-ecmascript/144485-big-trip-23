import { generateTripEvent } from '../mock/trip-event.js';

const EVENT_COUNT = 3;

export default class PointsModel {
  event = Array.from({ length: EVENT_COUNT }, generateTripEvent);

  getEvent() {
    return this.event;
  }
}
