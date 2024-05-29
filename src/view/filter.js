import AbstractView from '../framework/view/abstract-view.js';

const createFilterItem = (filter) => {
  const { type, count } = filter;
  return `<div class="trip-filters__filter">
  <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}"
  ${count === 0 ? 'disabled' : ''} ${type === 'everything' ? 'checked' : ''}
  >
  <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
</div>`;
};

const createFilterList = (array) => array.map((filter, index) => createFilterItem(filter, index === 0)).join('');

const createFilterPanel = (filters) => {
  const filtersList = createFilterList(filters);

  return `<form class="trip-filters" action="#" method="get">
                ${filtersList}

             <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class Filter extends AbstractView {
  #filters = [];
  constructor({ filters }) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterPanel(this.#filters);
  }
}
