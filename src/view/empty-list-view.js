import AbstractView from './abstract-view';


export default class EmptyListView extends AbstractView {
  #notification = null;

  constructor(notification) {
    super();
    this.#notification = notification;
  }

  get template() {
    return `<p class="trip-events__msg">${this.#notification}</p>`;
  }
}
