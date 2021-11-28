import {render} from './utils/utils';
import {RenderPosition} from './consts';
import {getPoint} from './mock/point';

import {createMenuView} from './view/menu-view';
import {createFiltersView} from './view/filters-view';
import {createSortingView} from './view/sorting-view';
import {createPointsListView} from './view/points-list-view';
import {createPointView} from './view/point-view';
import {createEditPointView} from './view/edit-point-view';
import {createInfoView} from './view/info-view';


const POINTS_VALUE = 15;
const points = Array.from({length: POINTS_VALUE}, getPoint);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');


const menuTemplate = createMenuView();
const filtersTemplate = createFiltersView();
const sortingTemplate = createSortingView();
const pointsListTemplate = createPointsListView();
const editPointTemplate = createEditPointView(points[0]);
const infoTemplate = createInfoView(points); // TODO вью еще поправить


render(menuContainer, menuTemplate, RenderPosition.BEFOREEND);
render(infoContainer, infoTemplate, RenderPosition.AFTERBEGIN);
render(filtersContainer, filtersTemplate, RenderPosition.BEFOREEND);
render(mainContainer, sortingTemplate, RenderPosition.BEFOREEND);
render(mainContainer, pointsListTemplate, RenderPosition.BEFOREEND);


const pointsListContainer = mainContainer.querySelector('.trip-events__list');

render(pointsListContainer, editPointTemplate, RenderPosition.BEFOREEND);
for (let i = 1; i < POINTS_VALUE; i++) {
  render(pointsListContainer, createPointView(points[i]), RenderPosition.BEFOREEND);
}


