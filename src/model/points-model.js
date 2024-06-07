import { MOCKED_EVENTS } from '../mock/trip-event.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #tripEventAll = null;
  constructor() {
    super();
    this.#tripEventAll = MOCKED_EVENTS;
  }

  get event() {
    return this.#tripEventAll;
  }

  updatePoint(updateType, update) {
    const index = this.#tripEventAll.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#tripEventAll = [
      ...this.#tripEventAll.slice(0, index),
      update,
      ...this.#tripEventAll.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    update.id = crypto.randomUUID();
    this.#tripEventAll = [
      update,
      ...this.#tripEventAll,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#tripEventAll.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#tripEventAll = [
      ...this.#tripEventAll.slice(0, index),
      ...this.#tripEventAll.slice(index + 1)
    ];

    this._notify(updateType);
  }
}

