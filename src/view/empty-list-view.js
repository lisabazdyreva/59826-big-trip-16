import AbstractView from './abstract-view';
import {NoFilteredPointsMessage} from '../consts';


export default class EmptyListView extends AbstractView {
  #message = null;

  constructor(type) {
    super();
    this.#message = NoFilteredPointsMessage[type];
  }

  get template() {
    return `<p class="trip-events__msg">${this.#message}</p>`;
  }
}
