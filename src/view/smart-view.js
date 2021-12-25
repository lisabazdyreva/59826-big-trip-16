import AbstractView from './abstract-view';
import {ErrorMessage} from '../consts';

export default class SmartView extends AbstractView {
  _state = {};

  restoreHandlers = () => {
    throw new Error(ErrorMessage.METHOD);
  }

  #updateElement = () => {
    const prevElement = this.element;
    const parent = prevElement.parentElement;

    this.removeElement();

    const newElement = this.element;
    parent.replaceChild(newElement, prevElement);

    this.restoreHandlers();
  }

  updateState = (update) => {
    this._state = {...this._state, ...update};
    this.#updateElement();
  }
}
