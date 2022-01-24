import FiltersView from '../view/filters-view';

import {FiltersType, RenderPosition, UpdateType} from '../consts';
import {remove, render, replace} from '../utils/render-utils';
import {filterPoints} from '../utils/utils';


export default class FiltersPresenter {
  #container = null;

  #prevComponent = null;
  #component = null;

  #model = null;
  #pointsModel = null;

  constructor(container, model, pointsModel) {
    this.#container = container;
    this.#model = model;

    this.#pointsModel = pointsModel;
  }

  get activeFilter() {
    return this.#model.activeFilter;
  }

  get pastPointsLength() {
    return filterPoints[FiltersType.PAST](this.#pointsModel.points).length;
  }

  get futurePointsLength() {
    return filterPoints[FiltersType.FUTURE](this.#pointsModel.points).length;
  }

  init = () => {
    this.#prevComponent = this.#component;
    this.#component = new FiltersView(this.activeFilter, this.pastPointsLength, this.futurePointsLength);

    this.#component.setFilterChangeHandler(this.#activeFilterChangeHandler);

    this.#model.add(this.init);
    this.#pointsModel.add(this.init);

    if (this.#prevComponent === null) {
      this.#renderFilters();
      return;
    }

    replace(this.#component, this.#prevComponent);
    remove(this.#prevComponent);
  }

  remove = () => {
    remove(this.#component);
    this.#component = null;
  }

  #renderFilters = () => {
    render(this.#container, this.#component, RenderPosition.BEFOREEND);
  }

  #activeFilterChangeHandler = (currentFilter) => {
    if (this.#model.activeFilter === currentFilter) {
      return;
    }

    this.#model.setActiveFilter(UpdateType.MAJOR, currentFilter);
  }
}
