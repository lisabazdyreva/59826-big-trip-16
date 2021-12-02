import {createElement} from '../utils/utils';

export default class PointsListView {
  #element = null;

  get template() {
    return '<ul class="trip-events__list"></ul>';
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}

