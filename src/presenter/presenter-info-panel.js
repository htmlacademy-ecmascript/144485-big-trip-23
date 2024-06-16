import TripInfo from '../view/trip-info.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';
import { sortByDay } from '../utils/sort.js';

export default class PresenterInfoPanel {
  #tripInfoContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;

  constructor({ tripInfoContainer, pointsModel }) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.events.sort(sortByDay);
    const offers = this.#pointsModel.offers;
    const destinations = this.#pointsModel.destinations;
    const prevInfoComponent = this.#tripInfoComponent;
    this.#tripInfoComponent = new TripInfo(points, offers, destinations);

    if (prevInfoComponent === null) {
      render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };
}
