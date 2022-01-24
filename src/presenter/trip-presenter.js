import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import SortingView from '../view/sorting-view';
import LoadingView from '../view/loading-view';

import PointPresenter from './point-presenter';
import AddPointPresenter from './add-point-presenter';

import {DefaultValue, RenderPosition, State, UpdateType, UserPointAction} from '../consts';
import {remove, render} from '../utils/render-utils';
import {filterPoints, sortPoints} from '../utils/utils';


export default class TripPresenter {
  #mainContainer = null;

  #pointsListComponent = null;
  #emptyListComponent = null;

  #sortingComponent = new SortingView(DefaultValue.SORTING);
  #loadingComponent = new LoadingView();

  #pointsModel = null;
  #filtersModel = null;

  #destinationsModel = null;
  #offersModel = null;

  #newPointPresenter = null;
  #filtersPresenter = null;
  #menuPresenter = null;

  #destinations = null;
  #names = null;
  #offers = null;
  #types = null;

  #isLoading = true;
  #pointPresenters = new Map();

  #activeSortingType = DefaultValue.SORTING;
  #activeFilterType = DefaultValue.FILTER;

  constructor(mainContainer, pointsModel, filtersModel, destinationsModel, offersModel, filtersPresenter, menuPresenter) {
    this.#mainContainer = mainContainer;

    this.#pointsModel = pointsModel;
    this.#filtersModel = filtersModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#filtersPresenter = filtersPresenter;
    this.#menuPresenter = menuPresenter;

    this.#newPointPresenter = new AddPointPresenter(this.#handleViewAction, this.#menuPresenter.enableAddButton);
  }

  get points() {
    const points = this.#pointsModel.points;
    this.#activeFilterType = this.#filtersModel.activeFilter;
    const filteredPoints = filterPoints[this.#activeFilterType](points);

    return sortPoints(this.#activeSortingType, filteredPoints);
  }

  get pointsLength() {
    return this.points.length;
  }

  init = () => {
    this.#renderMainContent();

    this.#filtersPresenter.init();
    this.#menuPresenter.init();

    this.#menuPresenter.setPointAddHandler(this.#createPoint);

    this.#addObservers();
  }

  #addObservers = () => {
    this.#pointsModel.add(this.#handleModelEvent);
    this.#filtersModel.add(this.#handleModelEvent);

    this.#offersModel.add(this.#handleModelEvent);
    this.#destinationsModel.add(this.#handleModelEvent);
  }

  #removeObservers = () => {
    this.#pointsModel.remove(this.#handleModelEvent);
    this.#filtersModel.remove(this.#handleModelEvent);

    this.#offersModel.remove(this.#handleModelEvent);
    this.#destinationsModel.remove(this.#handleModelEvent);
  }

  #renderPoint = (container, point) => {
    const pointPresenter = new PointPresenter(container, this.#handleViewAction, this.#pointModeChangeHandler, this.#destinations, this.#offers, this.#types, this.#names);
    pointPresenter.init(point, this.#newPointPresenter.remove);

    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #createPoint = () => {
    this.#resetFilter();

    if (!this.pointsLength) {
      this.#renderPointsList();
      this.#removeEmptyTrip();
      this.#newPointPresenter.setFormDeleteHandler(this.#renderEmptyTrip);
    }

    this.#newPointPresenter.init(this.#pointsListComponent, this.#destinations, this.#offers, this.#types, this.#names);
  }

  #renderPoints = () => {
    this.points.slice().forEach((point) => this.#renderPoint(this.#pointsListComponent, point));
  }

  #removePoints = () => {
    this.#pointPresenters.forEach((presenter) => presenter.removePointComponent());
    this.#pointPresenters.clear();
  }

  #removePointsList = () => {
    if (this.#pointsListComponent !== null) {
      remove(this.#pointsListComponent);
      this.#pointsListComponent = null;
    }
  }

  #renderSorting = () => {
    render(this.#mainContainer, this.#sortingComponent, RenderPosition.BEFOREEND);
    this.#sortingComponent.setSortingChangeHandler(this.#sortingTypeChangeHandler);
  }

  #removeSorting = () => {
    remove(this.#sortingComponent);
  }

  #renderPointsList = () => {
    this.#pointsListComponent = new PointsListView();
    render(this.#mainContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
  }

  #renderTrip = () => {
    this.#renderSorting();
    this.#renderPointsList();
    this.#renderPoints();
  }

  #removeMainContent = () => {
    this.#newPointPresenter.remove();

    this.#removeEmptyTrip();
    this.#removeSorting();

    this.#activeSortingType = DefaultValue.SORTING;

    this.#removePointsList();
    this.#removePoints();
  }

  #renderMainContent = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (!this.pointsLength) {
      this.#renderEmptyTrip();
    } else {
      this.#renderTrip();
    }
  }

  #renderEmptyTrip = () => {
    this.#emptyListComponent = new EmptyListView(this.#activeFilterType);
    render(this.#mainContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  }

  #removeEmptyTrip = () => {
    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }
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

    this.#removePoints();
    this.#renderPoints();
  }

  #pointModeChangeHandler = () => {
    this.#newPointPresenter.remove();
    this.#pointPresenters.forEach((presenter) => presenter.resetMode());
  }

  #resetFilter = () => {
    this.#activeFilterType = DefaultValue.FILTER;
    this.#filtersModel.setActiveFilter(UpdateType.MAJOR, this.#activeFilterType);
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#removePointsList();
        this.#removePoints();
        this.#renderPointsList();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#removeMainContent();
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
        this.#pointPresenters.get(updatingItem.id).setViewState(State.SAVING);
        try {
          await this.#pointsModel.updatePoint(updateType, updatingItem);
        } catch (err) {
          this.#pointPresenters.get(updatingItem.id).setViewState(State.ABORTING);
        }
        break;
      case UserPointAction.ADD:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, updatingItem);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserPointAction.DELETE:
        this.#pointPresenters.get(updatingItem.id).setViewState(State.DELETING);
        try {
          await this.#pointsModel.removePoint(updateType, updatingItem);
        } catch (err) {
          this.#pointPresenters.get(updatingItem.id).setViewState(State.ABORTING);
        }
        break;
    }
  }

  remove = () => {
    this.#resetFilter();
    this.#removeMainContent();

    this.#filtersPresenter.remove();
    this.#removeObservers();
  }
}
