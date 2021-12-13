import {DefaultValue, RenderPosition} from '../consts';
import {render} from '../utils/render-utils';

import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import InfoView from '../view/info-view';
import SortingView from '../view/sorting-view';

import PointPresenter from './point-presenter';


export default class TripPresenter {

  #infoComponent = null;

  #mainContainer = null;
  #infoContainer = null;

  #pointsListComponent = new PointsListView();
  #emptyListComponent = new EmptyListView(DefaultValue.NOTIFICATION);
  #sortingComponent = new SortingView(DefaultValue.SORTING);

  #tripPoints = [];

  constructor(mainContainer, infoContainer) {
    this.#mainContainer = mainContainer;
    this.#infoContainer = infoContainer;
  }

  init = (points) => {
    this.#tripPoints = [...points];

    this.#renderMainContent();
  }

  #renderPoint = (container, point) => {
    const pointPresenter = new PointPresenter(container);
    pointPresenter.init(point);
  }

  #renderPoints = () => {
    this.#tripPoints.slice().forEach((point) => this.#renderPoint(this.#pointsListComponent, point));
  }

  #renderInfo = () => {
    this.#infoComponent = new InfoView(this.#tripPoints);
    render(this.#infoContainer, this.#infoComponent, RenderPosition.AFTERBEGIN);
  }

  #renderSorting = () => {
    render(this.#mainContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
  }

  #renderPointsList = () => {
    render(this.#mainContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints();
  }

  #renderTripComponents = () => {
    this.#renderInfo();
    this.#renderSorting();
    this.#renderPointsList();
  }

  #renderMainContent = () => {
    if (!this.#tripPoints.length) {
      this.#renderEmptyList();
    } else {
      this.#renderTripComponents();
    }
  }

  #renderEmptyList = () => {
    render(this.#mainContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  }
}
