import {createElement} from '../utils/utils';
import {ErrorMessage} from '../consts';

export default class AbstractView {
  #element = null;
  _callbacks = {};

  constructor() {
    if (new.target === AbstractView) {
      throw new Error(ErrorMessage.INSTANT);
    }
  }

  get template() {
    throw new Error(ErrorMessage.GETTER);
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
