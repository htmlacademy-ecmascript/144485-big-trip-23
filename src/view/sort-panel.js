import AbstractView from '../framework/view/abstract-view.js';
import { SORT_TYPE } from '../utils/sort.js';

function createSortPanel(currentSortType) {
  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">

    <div class="trip-sort__item  trip-sort__item--day">
      <input id="sort-day" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-day"
       ${currentSortType === SORT_TYPE.DAY ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-day" data-sort-type="${SORT_TYPE.DAY}">Day</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--event">
      <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" disabled>
      <label class="trip-sort__btn" for="sort-event">Event</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--time">
      <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${currentSortType === SORT_TYPE.TIME ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-time" data-sort-type="${SORT_TYPE.TIME}">Time</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--price">
      <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${currentSortType === SORT_TYPE.PRICE ? 'checked' : ''}>
      <label class="trip-sort__btn" for="sort-price" data-sort-type="${SORT_TYPE.PRICE}">Price</label>
    </div>

    <div class="trip-sort__item  trip-sort__item--offer">
      <input id="sort-offer" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-offer" disabled>
      <label class="trip-sort__btn" for="sort-offer">Offers</label>
    </div>
  </form>`;
}

export default class SortPanel extends AbstractView {
  #onSortTypeChange = null;
  #currentSortType = null;

  constructor({ currentSortType, onSortTypeChange }) {
    super();

    this.#currentSortType = currentSortType;
    this.#onSortTypeChange = onSortTypeChange;

    this.element.addEventListener('click', this.#sortTypeClickHandler);
  }

  get template() {
    return createSortPanel(this.#currentSortType);
  }

  #sortTypeClickHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.hasAttribute('data-sort-type')) {
      this.#onSortTypeChange(evt.target.dataset.sortType);
    }
  };
}
