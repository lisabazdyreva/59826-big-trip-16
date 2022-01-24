import AbstractView from './abstract-view';
import {MenuTab} from '../consts';


const menuTabs = Object.values(MenuTab);


const createMenuView = (activeTab) => `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuTabs.map((tab) => {
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

  setMenuTabClickHandler = (cb) => {
    this._callbacks.menuClickHandler = cb;
    this.element.addEventListener('click', this.#menuClickHandler);
  }

  #menuClickHandler = (evt) => {
    evt.preventDefault();
    this.#activeTab = evt.target.textContent;

    this._callbacks.menuClickHandler(this.#activeTab);
  }
}
