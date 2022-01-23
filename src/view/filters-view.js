import AbstractView from './abstract-view';
import {FiltersType} from '../consts';


const filterValuesList = Object.values(FiltersType);

const isDisabled = (filter, length, type) => !length && filter === type ? 'disabled': '';

const createFiltersView = (activeFilter, pastPointsLength, futurePointsLength) => `<form class="trip-filters" action="#" method="get">
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
        ${isDisabled(filter, pastPointsLength, FiltersType.PAST)}
        ${isDisabled(filter, futurePointsLength, FiltersType.FUTURE)}
      >
      <label class="trip-filters__filter-label" for="filter-${filter}">${filterText}</label>
    </div>`;}).join('')}

  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`;


export default class FiltersView extends AbstractView {
  #activeFilter = null;

  #pastPointsLength = null;
  #futurePointsLength = null;

  constructor(activeFilter, pastPointLength, futurePointsLength) {
    super();
    this.#activeFilter = activeFilter;
    this.#pastPointsLength = pastPointLength;
    this.#futurePointsLength = futurePointsLength;
  }

  get template() {
    return createFiltersView(this.#activeFilter, this.#pastPointsLength, this.#futurePointsLength);
  }

  setClickFilterHandler = (cb) => {
    this._callbacks.clickFilterHandler = cb;
    this.element.addEventListener('change', this.#clickFilterHandler);
  }

  #clickFilterHandler = (evt) => {
    this._callbacks.clickFilterHandler(evt.target.value);
  }
}
