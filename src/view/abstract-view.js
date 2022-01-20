import {createElement} from '../utils/utils';
import {ErrorMessage} from '../consts';

const ANIMATION_TIMEOUT = 600;

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

  shake = (cb = null) => {
    this.element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this.element.style.animation = '';
      if (cb !== null) {
        cb();
      }
    }, ANIMATION_TIMEOUT);

  }
}
