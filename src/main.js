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


const POINTS_VALUE = 15;
const points = Array.from({length: POINTS_VALUE}, getPoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');


const menuElement = new MenuView(DefaultValue.MENU).element;
const filtersElement = new FiltersView(DefaultValue.FILTER).element;
const sortingElement = new SortingView(DefaultValue.SORTING).element;
const pointsListElement = new PointsListView().element;
const infoElement = new InfoView(points).element; // TODO вью еще поправить


render(menuContainer, menuElement, RenderPosition.BEFOREEND);
render(infoContainer, infoElement, RenderPosition.AFTERBEGIN);
render(filtersContainer, filtersElement, RenderPosition.BEFOREEND);
render(mainContainer, sortingElement, RenderPosition.BEFOREEND);
render(mainContainer, pointsListElement, RenderPosition.BEFOREEND);


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


for (let i = 0; i < POINTS_VALUE; i++) {
  renderPoint(pointsListElement, points[i]);
}


