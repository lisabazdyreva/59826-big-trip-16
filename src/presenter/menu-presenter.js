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

  #addPointHandler = null;
  #menuClickHandler = null;

  #pointsModel = null;
  #menuModel = null;

  #points = [];

  constructor(menuModel, pointsModel, menuContainer, infoContainer, menuClickHandler) {
    this.#pointsModel = pointsModel;
    this.#menuModel = menuModel;

    this.#menuContainer = menuContainer;
    this.#infoContainer = infoContainer;

    this.#menuClickHandler = menuClickHandler;

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

    this.#menuComponent.setMenuClickHandler(this.#handleMenuClick);

    this.#pointsModel.add(this.#handlePointsModelEvent);
    this.#menuModel.add(this.#handleModelEvent);

    if (this.#menuPrevComponent === null) {
      this.#renderMenu();
      return;
    }

    replace(this.#menuComponent, this.#menuPrevComponent);
    remove(this.#menuPrevComponent);
  }


  setAddPointHandler = (cb) => {
    this.#addPointHandler = cb;
    this.#addButtonElement.addEventListener('click', this.#clickAddButtonHandler);
  }

  #clickAddButtonHandler = () => {
    this.disableAddButton();
    this.#addPointHandler();
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

  #handleMenuClick = (menuItem) => {
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
