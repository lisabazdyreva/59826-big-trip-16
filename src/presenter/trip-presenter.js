import {DefaultValue, RenderPosition} from '../consts';
import {render, replaceChild} from '../utils/render-utils';
import {isEsc} from '../utils/utils';

import PointsListView from '../view/points-list-view';
import EmptyListView from '../view/empty-list-view';
import InfoView from '../view/info-view';
import SortingView from '../view/sorting-view';
import PointView from '../view/point-view';
import EditPointView from '../view/edit-point-view';


export default class TripPresenter {

  #mainContainer = null;
  #infoContainer = null;

  #pointsListComponent = new PointsListView();
  #emptyListComponent = new EmptyListView(DefaultValue.NOTIFICATION);

  #tripPoints = [];

  constructor(mainContainer, infoContainer) {
    this.#mainContainer = mainContainer;
    this.#infoContainer = infoContainer;
  }

  init = (points) => {
    this.#tripPoints = [...points];

    this.renderMainContent();
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

  renderPoints = () => {
    this.#tripPoints.slice().forEach((point) => this.renderPoint(this.#pointsListComponent, point));
  }

  renderInfo = () => {
    const infoComponent = new InfoView(this.#tripPoints);
    render(this.#infoContainer, infoComponent, RenderPosition.AFTERBEGIN);
  }

  renderSorting = () => {
    const sortingComponent = new SortingView(DefaultValue.SORTING);
    render(this.#mainContainer, sortingComponent, RenderPosition.BEFOREEND);
  }

  renderPointsList = () => {
    render(this.#mainContainer, this.#pointsListComponent, RenderPosition.BEFOREEND);
    this.renderPoints();
  }

  renderTripComponents = () => {
    this.renderInfo();
    this.renderSorting();
    this.renderPointsList();
  }

  renderMainContent = () => {
    if (!this.#tripPoints.length) {
      this.renderEmptyList();
    } else {
      this.renderTripComponents();
    }
  }

  renderEmptyList = () => {
    render(this.#mainContainer, this.#emptyListComponent, RenderPosition.BEFOREEND);
  }
}
