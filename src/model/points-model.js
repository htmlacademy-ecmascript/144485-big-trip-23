// import { MOCKED_EVENTS } from '../mock/trip-event.js';
import Observable from '../framework/observable.js';
import { UpdateType } from '../utils.js/const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];
  constructor({ pointsApiService }) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get event() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      const offers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;

      this.#points = points.map(this.#adaptToClient);
      this.#offers = offers;
      this.#destinations = destinations;
    } catch (err) {
      this.#points = [];
      this.#offers = [];
      this.#destinations = [];
    }

    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }
    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1)
      ];

      this._notify(updateType, updatedPoint);
    } catch (err) {
      throw new Error('Can\'t update point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  // updatePoint(updateType, update) {
  //   const index = this.#tripEventAll.findIndex((point) => point.id === update.id);

  //   if (index === -1) {
  //     throw new Error('Can\'t update unexisting point');
  //   }

  //   this.#tripEventAll = [
  //     ...this.#tripEventAll.slice(0, index),
  //     update,
  //     ...this.#tripEventAll.slice(index + 1)
  //   ];

  //   this._notify(updateType, update);
  // }

  addPoint(updateType, update) {
    update.id = crypto.randomUUID();
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1)
    ];

    this._notify(updateType);
  }

  getCurrentOffer(type) {
    if (this.offers) {
      return this.offers.find((item) => item.type === type);
    }
  }

  getDestinationId(id) {
    return this.destinations.find((item) => item.id === id);
  }
}

