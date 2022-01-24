import AbstractObservable from '../utils/abstract-observable';
import {DefaultValue} from '../consts';


export default class FiltersModel extends AbstractObservable {
  #activeFilter = DefaultValue.FILTER;

  setActiveFilter = (updateType, activeFilter) => {
    this.#activeFilter = activeFilter;
    this._notify(updateType, activeFilter);
  }

  get activeFilter() {
    return this.#activeFilter;
  }
}
