import {DefaultValue, RenderPosition, SortingType, UpdateType, UserPointAction} from '../consts';
import {remove, render} from '../utils/render-utils';
import {sortByDuration, sortByFromDate, sortByPrice} from '../utils/utils';

import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import InfoView from '../view/info-view';
import SortingView from '../view/sorting-view';

import PointPresenter from './point-presenter';


export default class TripPresenter {

  #pointsModel = null;

  #infoComponent = null;

  #mainContainer = null;
  #infoContainer = null;

  #pointsListComponent = new PointsListView();
  #emptyListComponent = new EmptyListView(DefaultValue.NOTIFICATION);
  #sortingComponent = new SortingView(DefaultValue.SORTING);

  #activeSortingType = DefaultValue.SORTING;
  #pointPresenters = new Map();

  constructor(mainContainer, infoContainer, pointsModel) {
    this.#mainContainer = mainContainer;
    this.#infoContainer = infoContainer;

    this.#pointsModel = pointsModel;
    this.#pointsModel.add(this.#handleModelEvent);
  }

  get points() {
    return this.#pointsModel.points;
  }

  init = () => {
    this.#renderMainContent();
  }

  #renderPoint = (container, point) => {
    const pointPresenter = new PointPresenter(container, this.#handleViewAction, this.#pointModeChangeHandler);
    pointPresenter.init(point);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPoints = () => {
    this.points.slice().forEach((point) => this.#renderPoint(this.#pointsListComponent, point));
  }

  #removePointsList = () => {
    this.#pointPresenters.forEach((presenter) => presenter.removePointComponent());
    this.#pointPresenters.clear();
  }

  #renderInfo = () => {
    this.#infoComponent = new InfoView(this.points);
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

  #removeTrip = () => {
    remove(this.#infoComponent);
    remove(this.#sortingComponent);
    this.#removePointsList();
  }

  #renderMainContent = () => {
    if (!this.points.length) {
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
        this.points.sort(sortByFromDate);
        break;
      case SortingType.TIME:
        this.points.sort(sortByDuration);
        break;
      case SortingType.PRICE:
        this.points.sort(sortByPrice);
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

  #pointModeChangeHandler = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetMode());
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#removePointsList();
        this.#renderPointsList();
        break;
      case UpdateType.MAJOR:
        this.#removeTrip(); // TODO это еще не точная реализация
        this.#renderTrip();
        break;
    }
  }

  #handleViewAction = (actionType, updateType, updatingItem) => {
    switch (actionType) {
      case UserPointAction.UPDATE:
        this.#pointsModel.updatePoint(updateType, updatingItem);
        break;
      case UserPointAction.ADD:
        this.#pointsModel.addPoint(updateType, updatingItem);
        break;
      case UserPointAction.DELETE:
        this.#pointsModel.removePoint(updateType, updatingItem);
        break;
    }
  }
}
