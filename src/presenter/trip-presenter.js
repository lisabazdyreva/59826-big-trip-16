import {DefaultValue, RenderPosition} from '../consts';

import MenuView from '../view/menu-view';
import FiltersView from '../view/filters-view';
import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import {render, replaceChild} from '../utils/render-utils';
import InfoView from '../view/info-view';
import SortingView from '../view/sorting-view';
import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';
import {isEsc} from '../utils/utils';


export default class TripPresenter {

  #menuContainer = null;
  #filtersContainer = null;
  #mainContainer = null;
  #infoContainer = null;

  #menuComponent = new MenuView(DefaultValue.MENU);
  #filtersComponent = new FiltersView(DefaultValue.FILTER);
  #pointsListComponent = new PointsListView();
  #emptyListComponent = new EmptyListView(DefaultValue.NOTIFICATION);

  #tripPoints = [];

  constructor(menuContainer, filtersContainer, mainContainer, infoContainer) {
    this.#menuContainer = menuContainer;
    this.#filtersContainer = filtersContainer;
    this.#mainContainer = mainContainer;
    this.#infoContainer = infoContainer;
  }

  init = (points) => {
    this.#tripPoints = [...points];
  }

  renderMenu = () => {
    render(this.#menuContainer, this.#menuComponent, RenderPosition.BEFOREEND);
  }

  renderFilters = () => {
    render(this.#filtersContainer, this.#filtersComponent, RenderPosition.BEFOREEND);
  }

  renderPoint = (container, point) => {
    const pointComponent = new PointView(point);
    const editPointComponent = new EditPointView(point);

    const formEscHandler = (evt) => {
      if (isEsc(evt.code)) {
        replaceChild(pointComponent, editPointComponent);
        document.removeEventListener('keydown', formEscHandler);
      }
    };

    const buttonOpenClickHandler = () => {
      replaceChild(editPointComponent, pointComponent);
      document.addEventListener('keydown', formEscHandler);
    };

    const buttonCloseClickHandler = () => {
      replaceChild(pointComponent, editPointComponent);
      document.removeEventListener('keydown', formEscHandler);
    };

    const formSubmitHandler = () => {
      replaceChild(pointComponent, editPointComponent);
      document.removeEventListener('keydown', formEscHandler);
    };

    pointComponent.setClickHandler(buttonOpenClickHandler);

    editPointComponent.setClickHandler(buttonCloseClickHandler);
    editPointComponent.setSubmitHandler(formSubmitHandler);

    render(container, pointComponent, RenderPosition.BEFOREEND);
  }

  renderMainContent = () => {
    if (!this.#tripPoints.length) {
      render(this.#mainContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
    } else {
      const infoComponent = new InfoView(this.#tripPoints);
      const sortingComponent = new SortingView(DefaultValue.SORTING);

      render(this.#infoContainer, infoComponent, RenderPosition.AFTERBEGIN);
      render(this.#mainContainer, sortingComponent, RenderPosition.BEFOREEND);
      render(this.#mainContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);

      this.#tripPoints.forEach((point) => this.renderPoint(this.#pointsListComponent, point));

    }
  }

}
