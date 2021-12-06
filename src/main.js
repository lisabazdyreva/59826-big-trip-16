import {isEsc} from './utils/utils';
import {removeComponent, render, replaceChild} from './utils/render-utils';

import {RenderPosition, DefaultValue} from './consts';
import {getPoint} from './mock/point';

import MenuView from './view/menu-view';
import FiltersView from './view/filters-view';
import SortingView from './view/sorting-view';
import PointsListView from './view/points-list-view';
import PointView from './view/point-view';
import EditPointView from './view/edit-point-view';
import InfoView from './view/info-view';
import EmptyListView from './view/empty-list-view';


const PointsValue = {
  FULL: 15,
  EMPTY: 0,
};

const data = Array.from({length: PointsValue.FULL}, getPoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');


const menuComponent = new MenuView(DefaultValue.MENU);
const filtersComponent = new FiltersView(DefaultValue.FILTER);
const pointsListComponent = new PointsListView();
const emptyListElement = new EmptyListView(DefaultValue.NOTIFICATION).element;


render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
render(filtersContainer, filtersComponent, RenderPosition.BEFOREEND);


const renderPoint = (container, point) => {
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
};


const renderMainContent = (points) => {
  if (!points.length) {
    render(mainContainer, emptyListElement, RenderPosition.BEFOREEND);
  } else {
    const infoComponent= new InfoView(points);
    const sortingComponent = new SortingView(DefaultValue.SORTING);

    render(infoContainer, infoComponent, RenderPosition.AFTERBEGIN);
    render(mainContainer, sortingComponent, RenderPosition.BEFOREEND);
    render(mainContainer, pointsListComponent, RenderPosition.BEFOREEND);

    for (let i = 0; i < PointsValue.FULL; i++) {
      renderPoint(pointsListComponent, points[i]);
    }
  }
};


renderMainContent(data);
