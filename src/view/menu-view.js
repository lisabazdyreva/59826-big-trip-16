import {MenuTab} from '../consts';
import AbstractView from './abstract-view';


const menuTabsList = Object.values(MenuTab);


const createMenuView = (activeTab) => `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuTabsList.map((tab) => {
    const isActive = activeTab === tab ? 'trip-tabs__btn--active' : '';
    return `<a class="trip-tabs__btn ${isActive}" href="#">${tab}</a>`;}).join('')}
</nav>`;

export default class MenuView extends AbstractView {
  #activeTab = null;

  constructor(activeTab) {
    super();
    this.#activeTab  = activeTab;
  }

  get template() {
    return createMenuView(this.#activeTab);
  }
}
