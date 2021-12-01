import {render, replaceChild} from './utils/utils';
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

  const replacePointToEdit = () => {
    replaceChild(editPointElement, pointElement, container);
  };

  const replaceEditToPoint = () => {
    replaceChild(pointElement, editPointElement, container);
  };

  pointElement.querySelector('.event__rollup-btn').addEventListener('click', replacePointToEdit);

  editPointElement.querySelector('.event__rollup-btn').addEventListener('click', replaceEditToPoint);
  editPointElement.querySelector('.event--edit').addEventListener('submit', replaceEditToPoint);

  render(container, pointElement, RenderPosition.BEFOREEND);
};


for (let i = 0; i < POINTS_VALUE; i++) {
  renderPoint(pointsListElement, points[i]);
}


