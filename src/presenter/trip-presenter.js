import {DefaultValue, RenderPosition, UpdateType, UserPointAction} from '../consts';
import {remove, render} from '../utils/render-utils';
import {filterPoints, sortPoints} from '../utils/utils';

import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import SortingView from '../view/sorting-view';
import LoadingView from '../view/loading-view';

import PointPresenter from './point-presenter';
import AddPointPresenter from './add-point-presenter';


export default class TripPresenter {

  #isLoading = true;

  #destinations = null;
  #names = null;
  #offers = null;
  #types = null;

  #pointsModel = null;
  #filtersModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #mainContainer = null;

  #pointsListComponent = new PointsListView();
  #loadingComponent = new LoadingView();
  #emptyListComponent = null;
  #sortingComponent = new SortingView(DefaultValue.SORTING);

  #activeSortingType = DefaultValue.SORTING;
  #activeFilterType = DefaultValue.FILTER;

  #pointPresenters = new Map();
  #newPointPresenter = null;
  #filtersPresenter = null;
  #menuPresenter = null;

  constructor(mainContainer, pointsModel, filtersModel, destinationsModel, offersModel, filtersPresenter, menuPresenter) {
    this.#mainContainer = mainContainer;

    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#filtersPresenter = filtersPresenter;
    this.#menuPresenter = menuPresenter;
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#activeFilterType = this.#filtersModel.activeFilter;
    const filteredPoints = filterPoints[this.#activeFilterType](points);

    return sortPoints(this.#activeSortingType, filteredPoints);
  }

  init = () => {
    this.#renderMainContent();
    this.#filtersPresenter.init();
    this.#menuPresenter.init();
    this.#menuPresenter.setAddPointHandler(this.#createPoint);

    this.#addObservers();
  }

  #addObservers = () => {
    this.#pointsModel.add(this.#handleModelEvent);
    this.#filtersModel.add(this.#handleModelEvent);

    this.#offersModel.add(this.#handleModelEvent);
    this.#destinationsModel.add(this.#handleModelEvent);
  }

  #renderPoint = (container, point) => {
    const pointPresenter = new PointPresenter(container, this.#handleViewAction, this.#pointModeChangeHandler, this.#destinations, this.#offers, this.#types, this.#names);
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

  #renderSorting = () => {
    render(this.#mainContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
    this.#sortingComponent.setSortingChangeHandler(this.#sortingTypeChangeHandler);
  }

  #renderPointsList = () => {
    render(this.#mainContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
    this.#renderPoints();
  }

  #renderTrip = () => {
    this.#renderSorting();
    this.#renderPointsList();
  }

  #removeMainContent = () => {
    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
    }

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
    if (this.#newPointPresenter !== null) {
      this.#newPointPresenter.remove();
    }
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
        this.#isLoading = false;
        this.#removeLoading();
        this.#renderMainContent();
        break;
      case UpdateType.OFFERS_DOWNLOADED:
        this.#offers = this.#offersModel.offers;
        this.#types = this.#offersModel.types;
        break;
      case UpdateType.DESTINATIONS_DOWNLOADED:
        this.#destinations = this.#destinationsModel.destinations;
        this.#names = this.#destinationsModel.names;
        break;
    }
  }

  #handleViewAction = async (actionType, updateType, updatingItem) => {
    switch (actionType) {
      case UserPointAction.UPDATE:
        if (updateType !== UpdateType.PATCH) {
          this.#pointPresenters.get(updatingItem.id).setViewState('SAVING');
        }
        try {
          await this.#pointsModel.updatePoint(updateType, updatingItem);
        } catch (err) {
          this.#pointPresenters.get(updatingItem.id).setViewState('ABORTING');
        }
        break;
      case UserPointAction.ADD:
        this.#pointsModel.addPoint(updateType, updatingItem);
        break;
      case UserPointAction.DELETE:
        this.#pointPresenters.get(updatingItem.id).setViewState('DELETING');
        try {
          await this.#pointsModel.removePoint(updateType, updatingItem);
        } catch (err) {
          this.#pointPresenters.get(updatingItem.id).setViewState('ABORTING');
        }

        break;
    }
  }

  #createPoint = () => {
    this.#activeFilterType = DefaultValue.FILTER;
    this.#filtersModel.setActiveFilter(UpdateType.MAJOR, this.#activeFilterType); // TODO сортировка сбрасывается, потому что мажор. Мб нужен не мажор. Тогда нужно дропать точку при перерисовке списка точек
    this.#newPointPresenter = new AddPointPresenter(this.#pointsListComponent, this.#handleViewAction, this.#menuPresenter.undisableAddButton, this.#destinations, this.#offers, this.#types, this.#names);

    this.#newPointPresenter.init();
  }

  #removeObservers = () => {
    this.#pointsModel.remove(this.#handleModelEvent);
    this.#filtersModel.remove(this.#handleModelEvent);
    this.#offersModel.remove(this.#handleModelEvent);
    this.#destinationsModel.remove(this.#handleModelEvent);
  }


  remove = () => {
    this.#pointModeChangeHandler();

    this.#activeFilterType = DefaultValue.FILTER;
    this.#filtersModel.setActiveFilter(UpdateType.MAJOR, this.#activeFilterType);

    this.#removeMainContent();

    this.#filtersPresenter.remove();
    this.#removeObservers();
  }

}
