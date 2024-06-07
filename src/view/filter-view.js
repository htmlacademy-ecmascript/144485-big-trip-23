import AbstractView from '../framework/view/abstract-view.js';

const createFilterItem = (filter, currentFilter) => {
  const { name, count } = filter;
  return `<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}"
  ${count === 0 ? 'disabled' : ''} ${name === currentFilter ? 'checked' : ''}
  >
  <label class="trip-filters__filter-label" for="filter-${name}" ${filter.count === 0 ? 'disabled' : ''}>${name}</label>
</div>`;
};

const createFilterList = (array, currentFilter) => array.map((filter) => createFilterItem(filter, currentFilter)).join('');

const createFilterPanel = (filters, currentFilter) => {
  const filtersList = createFilterList(filters, currentFilter);

  return `<form class="trip-filters" action="#" method="get">
                ${filtersList}

             <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

export default class FilterView extends AbstractView {
  #filters = null;
  #currentFilter = null;
  #handleFilterChange = null;
  constructor({ filters, currentFilterType, onFilterChange }) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHadler);
  }

  get template() {
    return createFilterPanel(this.#filters, this.#currentFilter);
  }

  #filterChangeHadler = (evt) => {
    evt.preventDefault();

    this.#handleFilterChange(evt.target.value);
  };
}
