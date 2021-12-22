import AbstractView from './abstract-view';

export default class SmartView extends AbstractView {
  _state = {};

  restoreHandlers = () => {
    throw new Error('Need implementation');
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
    if (!update) {
      return;
    } // TODO под вопросом, нужно ли

    this._state = {...this._state, ...update};

    this.#updateElement();
  }
}
