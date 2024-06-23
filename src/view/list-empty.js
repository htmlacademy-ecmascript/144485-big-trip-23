import AbstractView from '../framework/view/abstract-view.js';
import { tripMessagesEmpty } from '../utils/filter.js';

const createListEmpty = (filterType) => `<p class="trip-events__msg">${tripMessagesEmpty[filterType]}</p>`;

export default class ListEmpty extends AbstractView {
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createListEmpty(this.#filterType);
  }
}
