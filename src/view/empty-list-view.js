import {createElement} from '../utils/utils';


export default class EmptyListView {
  #notification = null;
  #element = null;

  constructor(notification) {
    this.#notification = notification;
  }

  get template() {
    return `<p class="trip-events__msg">${this.#notification}</p>`;
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
