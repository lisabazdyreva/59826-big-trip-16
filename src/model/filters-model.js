import AbstractObservable from '../utils/abstract-observable';
import {FiltersType} from '../consts';

export default class FiltersModel extends AbstractObservable {
  #activeFilter = FiltersType.EVERYTHING;

  setActiveFilter = (updateType, activeFilter) => {
    this.#activeFilter = activeFilter;
    this._notify(updateType, activeFilter);
  }

  get activeFilter() {
    return this.#activeFilter;
  }
}
