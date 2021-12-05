import {render, replaceChild, isEsc} from './utils/utils';
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


const menuElement = new MenuView(DefaultValue.MENU).element;
const filtersElement = new FiltersView(DefaultValue.FILTER).element;
const pointsListElement = new PointsListView().element;
const emptyListElement = new EmptyListView(DefaultValue.NOTIFICATION).element;


render(menuContainer, menuElement, RenderPosition.BEFOREEND);
render(filtersContainer, filtersElement, RenderPosition.BEFOREEND);


const renderPoint = (container, point) => {
  const pointElement = new PointView(point).element;
  const editPointElement = new EditPointView(point).element;

  const formEscHandler = (evt) => {
    if (isEsc(evt.code)) {
      replaceChild(pointElement, editPointElement, container);
      document.removeEventListener('keydown', formEscHandler);
    }
  };

  const buttonOpenClickHandler = () => {
    replaceChild(editPointElement, pointElement, container);
    document.addEventListener('keydown', formEscHandler);
  };

  const buttonCloseClickHandler = () => {
    replaceChild(pointElement, editPointElement, container);
    document.removeEventListener('keydown', formEscHandler);
  };

  const formSubmitHandler = () => {
    replaceChild(pointElement, editPointElement, container);
    document.removeEventListener('keydown', formEscHandler);
  };


  pointElement.querySelector('.event__rollup-btn').addEventListener('click', buttonOpenClickHandler);

  editPointElement.querySelector('.event__rollup-btn').addEventListener('click', buttonCloseClickHandler);
  editPointElement.querySelector('.event--edit').addEventListener('submit', formSubmitHandler);


  render(container, pointElement, RenderPosition.BEFOREEND);
};


const renderMainContent = (points) => {
  if(!points.length) {
    render(mainContainer, emptyListElement, RenderPosition.BEFOREEND);
  } else {
    const infoElement = new InfoView(points).element;
    const sortingElement = new SortingView(DefaultValue.SORTING).element;

    render(infoContainer, infoElement, RenderPosition.AFTERBEGIN);
    render(mainContainer, sortingElement, RenderPosition.BEFOREEND);
    render(mainContainer, pointsListElement, RenderPosition.BEFOREEND);

    for (let i = 0; i < PointsValue.FULL; i++) {
      renderPoint(pointsListElement, points[i]);
    }
  }
};


renderMainContent(data);
