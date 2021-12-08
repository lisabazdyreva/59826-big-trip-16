import {createElement} from '../utils/utils';

export default class AbstractView {
  #element = null;
  _callbacks = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Abstract class is not for instantiation');
    }
  }

  get template() {
    throw new Error('Getter template implementation is not available in abstract class');
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
