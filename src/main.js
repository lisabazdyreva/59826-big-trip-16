import {render} from './utils/utils';
import {RenderPosition, DefaultValue} from './consts';
import {getPoint} from './mock/point';

import MenuView from './view/menu-view';
import FiltersView from './view/filters-view';
import SortingView from './view/sorting-view';
import PointsListView from './view/points-list-view';
import PointView from './view/point-view';
import {createEditPointView} from './view/edit-point-view';
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
const editPointTemplate = createEditPointView(points[0]);
const infoElement = new InfoView(points).element; // TODO вью еще поправить


render(menuContainer, menuElement, RenderPosition.BEFOREEND, true);
render(infoContainer, infoElement, RenderPosition.AFTERBEGIN, true);
render(filtersContainer, filtersElement, RenderPosition.BEFOREEND, true);
render(mainContainer, sortingElement, RenderPosition.BEFOREEND, true);
render(mainContainer, pointsListElement, RenderPosition.BEFOREEND, true);


const pointsListContainer = mainContainer.querySelector('.trip-events__list');

render(pointsListContainer, editPointTemplate, RenderPosition.BEFOREEND);
for (let i = 1; i < POINTS_VALUE; i++) {
  render(pointsListContainer, new PointView(points[i]).element, RenderPosition.BEFOREEND, true);
}


