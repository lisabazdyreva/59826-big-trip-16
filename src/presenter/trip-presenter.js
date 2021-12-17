import {DefaultValue, RenderPosition, SortingType} from '../consts';
import {render} from '../utils/render-utils';
import {sortByDuration, sortByFromDate, sortByPrice, updateItem} from '../utils/utils';

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

  #activeSortingType = DefaultValue.SORTING;
  #sourcedPoints = [];
  #tripPoints = [];
  #pointPresenters = new Map();

  constructor(mainContainer, infoContainer) {
    this.#mainContainer = mainContainer;
    this.#infoContainer = infoContainer;
  }

  init = (points) => {
    this.#tripPoints = [...points];
    this.#sourcedPoints = [...points];

    this.#renderMainContent();
  }

  #renderPoint = (container, point) => {
    const pointPresenter = new PointPresenter(container, this.#pointDataChangeHandler, this.#pointModeChangeHandler);
    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.#tripPoints.slice().forEach((point) => this.#renderPoint(this.#pointsListComponent, point));
  }

  #removePointsList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.removePointComponent());
    this.#pointPresenters.clear();
  }

  #renderInfo = () => {
    this.#infoComponent = new InfoView(this.#tripPoints);
    render(this.#infoContainer, this.#infoComponent, RenderPosition.AFTERBEGIN);
  }

  #renderSorting = () => {
    render(this.#mainContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
    this.#sortingComponent.setSortingChangeHandler(this.#sortingTypeChangeHandler);
  }

  #renderPointsList = () => {
    render(this.#mainContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints();
  }

  #renderTrip = () => {
    this.#renderInfo();
    this.#renderSorting();
    this.#sortPoints(this.#activeSortingType);

    this.#renderPointsList();
  }

  #renderMainContent = () => {
    if (!this.#tripPoints.length) {
      this.#renderEmptyTrip();
    } else {
      this.#renderTrip();
    }
  }

  #renderEmptyTrip = () => {
    render(this.#mainContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  }

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortingType.DAY:
        this.#tripPoints.sort(sortByFromDate);
        break;
      case SortingType.TIME:
        this.#tripPoints.sort(sortByDuration);
        break;
      case SortingType.PRICE:
        this.#tripPoints.sort(sortByPrice);
        break;
    }

    this.#activeSortingType = sortType;
  }

  #sortingTypeChangeHandler = (activeSortingType) => {
    if (this.#activeSortingType === activeSortingType) {
      return;
    }

    this.#sortPoints(activeSortingType);
    this.#removePointsList();
    this.#renderPointsList();
  }

  #pointDataChangeHandler = (updatingPoint) => {
    this.#tripPoints = updateItem(this.#tripPoints, updatingPoint);
    this.#pointPresenters.get(updatingPoint.id).init(updatingPoint);
  }

  #pointModeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetMode());
  }
}
