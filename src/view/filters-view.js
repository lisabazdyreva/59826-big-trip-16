import {FiltersType} from '../consts';
import AbstractView from './abstract-view';

const filterValuesList = Object.values(FiltersType);

const createFiltersView = (activeFilter) => (
  `<form class="trip-filters" action="#" method="get">

    ${filterValuesList.map((filter) => {
    const filterText = filter.slice(0, 1).toUpperCase() + filter.slice(1);
    const isChecked = activeFilter === filter ? 'checked' : '';

    return `<div class="trip-filters__filter">
      <input
        id="filter-${filter}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value='${filter}'
        ${isChecked}
      >
      <label class="trip-filters__filter-label" for="filter-${filter}">${filterText}</label>
    </div>`;}).join('')}

    <button class="visually-hidden" type="submit">Accept filter</button>
   </form>`
);

export default class FiltersView extends AbstractView {
  #activeFilter = null;

  constructor(activeFilter) {
    super();
    this.#activeFilter = activeFilter;
  }

  get template() {
    return createFiltersView(this.#activeFilter);
  }

  setClickFilterHandler = (cb) => {
    this._callbacks.clickFilterHandler = cb;
    this.element.addEventListener('change', this.#clickFilterHandler);
  }

  #clickFilterHandler = (evt) => {
    this._callbacks.clickFilterHandler(evt.target.value);
  }
}
