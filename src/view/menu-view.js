import {MenuTab} from '../consts';
import {createElement} from '../utils/utils';


const menuTabsList = Object.values(MenuTab);


const createMenuView = (activeTab) => `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuTabsList.map((tab) => {
    const isActive = activeTab === tab ? 'trip-tabs__btn--active' : '';
    return `<a class="trip-tabs__btn ${isActive}" href="#">${tab}</a>`;}).join('')}
</nav>`;

export default class MenuView {
  #activeTab = null;
  #element = null;

  constructor(activeTab) {
    this.#activeTab  = activeTab;
  }

  get template() {
    return createMenuView(this.#activeTab);
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
