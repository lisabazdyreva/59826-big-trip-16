import {remove, render, replace} from '../utils/render-utils';
import {RenderPosition, UpdateType} from '../consts';
import FiltersView from '../view/filters-view';

export default class FiltersPresenter {
  #container = null;
  #model = null;
  #prevComponent = null;
  #component = null;

  constructor(container, model) {
    this.#container = container;
    this.#model = model;
  }

  get activeFilter() {
    return this.#model.activeFilter;
  }

  init = () => {
    this.#prevComponent = this.#component;
    this.#component = new FiltersView(this.activeFilter);

    this.#component.setClickFilterHandler(this.#changeFilterHandler);

    this.#model.add(this.#handleModelEvent);

    if (this.#prevComponent === null) {
      this.#renderFilters();
      return;
    }
    replace(this.#component, this.#prevComponent);
    remove(this.#prevComponent);
  }

  remove = () => {
    // this.#component.removeElement() // TODO посмотреть еще removeElement, что он вообще делает
    remove(this.#component);
    this.#component = null;
  }

  #renderFilters = () => {
    render(this.#container, this.#component, RenderPosition.BEFOREEND);
  }

  #changeFilterHandler = (currentFilter) => {
    if (this.#model.activeFilter === currentFilter) {
      return;
    }

    this.#model.setActiveFilter(UpdateType.MAJOR, currentFilter);
  }

  #handleModelEvent = () => {
    this.init();
  }
}
