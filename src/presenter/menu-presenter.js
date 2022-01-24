import MenuView from '../view/menu-view';
import InfoView from '../view/info-view';

import {RenderPosition, UpdateType} from '../consts';
import {remove, render, replace} from '../utils/render-utils';


export default class MenuPresenter {
  #menuContainer = null;
  #infoContainer = null;

  #menuPrevComponent = null;
  #menuComponent = null;

  #infoComponent = null;
  #addButtonElement = null;

  #pointAddHandler = null;
  #menuClickHandler = null;

  #pointsModel = null;
  #menuModel = null;

  #points = [];

  constructor(menuModel, pointsModel, menuContainer, infoContainer) {
    this.#pointsModel = pointsModel;
    this.#menuModel = menuModel;

    this.#menuContainer = menuContainer;
    this.#infoContainer = infoContainer;

    this.#addButtonElement = document.querySelector('.trip-main__event-add-btn');
  }

  get activeMenuTab() {
    return this.#menuModel.activeMenuTab;
  }

  get points() {
    this.#points = this.#pointsModel.points;
    return this.#points;
  }

  init = () => {
    this.#menuPrevComponent = this.#menuComponent;
    this.#menuComponent = new MenuView(this.activeMenuTab);

    this.#menuComponent.setMenuTabClickHandler(this.#activeMenuTabClickHandler);

    this.#pointsModel.add(this.#handlePointsModelEvent);
    this.#menuModel.add(this.#handleModelEvent);

    if (this.#menuPrevComponent === null) {
      this.#renderMenu();
      return;
    }

    replace(this.#menuComponent, this.#menuPrevComponent);
    remove(this.#menuPrevComponent);
  }

  setPointAddHandler = (cb) => {
    this.#pointAddHandler = cb;
    this.#addButtonElement.addEventListener('click', this.#buttonAddClickHandler);
  }

  setMenuClickHandler = (cb) => {
    this.#menuClickHandler = cb;
  }

  #buttonAddClickHandler = () => {
    this.disableAddButton();
    this.#pointAddHandler();
  }

  #handlePointsModelEvent = () => {
    if (this.#infoComponent !== null) {
      remove(this.#infoComponent);
      this.#infoComponent = null;
    }

    if (!this.points.length) {
      return;
    }

    this.#renderInfo();
  }

  #handleModelEvent = () => {
    this.init();
  }

  #renderMenu = () => {
    render(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
  }

  #renderInfo = () => {
    this.#infoComponent = new InfoView(this.points);
    render(this.#infoContainer, this.#infoComponent, RenderPosition.AFTERBEGIN);
  }

  #activeMenuTabClickHandler = (menuItem) => {
    if (menuItem === this.activeMenuTab) {
      return;
    }

    this.#menuModel.setActiveMenuTab(UpdateType.MINOR, menuItem);
    this.#menuClickHandler(menuItem);
  };

  disableAddButton = () => {
    this.#addButtonElement.disabled = true;
  }

  enableAddButton = () => {
    this.#addButtonElement.disabled = false;
  }
}
