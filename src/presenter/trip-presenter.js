import {DefaultValue, RenderPosition, UpdateType, UserPointAction} from '../consts';
import {remove, render} from '../utils/render-utils';
import {filterPoints, sortPoints} from '../utils/utils';

import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import InfoView from '../view/info-view';
import SortingView from '../view/sorting-view';
import LoadingView from '../view/loading-view';

import PointPresenter from './point-presenter';
import AddPointPresenter from './add-point-presenter';


export default class TripPresenter {

  #isLoading = true;

  #pointsModel = null;
  #filtersModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #infoComponent = null;

  #mainContainer = null;
  #infoContainer = null;

  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #emptyListComponent = null;
  #sortingComponent = new SortingView(DefaultValue.SORTING);

  #activeSortingType = DefaultValue.SORTING;
  #activeFilterType = DefaultValue.FILTER;
  #pointPresenters = new Map();
  #newPointPresenter = null;

  constructor(mainContainer, infoContainer, pointsModel, filtersModel, destinationsModel, offersModel) {
    this.#mainContainer = mainContainer;
    this.#infoContainer = infoContainer;

    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#newPointPresenter = new AddPointPresenter(this.#pointsListComponent, this.#handleViewAction);

    this.#pointsModel.add(this.#handleModelEvent);
    this.#filtersModel.add(this.#handleModelEvent);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#activeFilterType = this.#filtersModel.activeFilter;
    const filteredPoints = filterPoints[this.#activeFilterType](points);

    return sortPoints(this.#activeSortingType, filteredPoints);
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
    this.#renderPointsList();
  }

  #removeMainContent = () => {
    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
    }

    remove(this.#infoComponent);
    remove(this.#sortingComponent);

    this.#activeSortingType = DefaultValue.SORTING;

    this.#removePointsList();
  }

  #renderMainContent = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!this.points.length) {
      this.#renderEmptyTrip();
    } else {
      this.#renderTrip();
    }
  }

  #renderEmptyTrip = () => {
    this.#emptyListComponent = new EmptyListView(this.#activeFilterType);
    render(this.#mainContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  }

  #renderLoading = () => {
    render(this.#mainContainer, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #removeLoading = () => {
    remove(this.#loadingComponent);
  }

  #sortingTypeChangeHandler = (activeSortingType) => {
    if (this.#activeSortingType === activeSortingType) {
      return;
    }

    this.#activeSortingType = activeSortingType;
    this.#removePointsList();
    this.#renderPointsList();
  }

  #pointModeChangeHandler = () => {
    this.#newPointPresenter.remove();
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
        this.#removeMainContent();// TODO это еще не точная реализация, ТЗ посмотреть
        this.#renderMainContent();
        break;
      case UpdateType.INIT:
        // this.#removeMainContent(); // TODO очистка подписи
        this.#isLoading = false;
        this.#removeLoading();
        this.#renderMainContent();
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

  createPoint = () => {
    this.#activeFilterType = DefaultValue.FILTER;
    this.#filtersModel.setActiveFilter(UpdateType.MAJOR, this.#activeFilterType); // TODO сортировка сбрасывается, потому что мажор. Мб нужен не мажор. Тогда нужно дропать точку при перерисовке списка точек

    this.#newPointPresenter.init();
  }

}
