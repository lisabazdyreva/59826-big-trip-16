import AbstractObservable from '../utils/abstract-observable';

export default class FiltersModel extends AbstractObservable {
  #activeFilter = null;

  set activeFilter(activeFilter) {
    this.#activeFilter = activeFilter;
  }

  get activeFilter() {
    return this.#activeFilter;
  }
}
