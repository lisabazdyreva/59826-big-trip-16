import {render} from './utils/utils';
import {RenderPosition} from './consts';

import {createMenuView} from './view/menu-view';
import {createFiltersView} from './view/filters-view';
import {createSortingView} from './view/sorting-view';
import {createPointsListView} from './view/points-list-view';
import {createPointView} from './view/point-view';
import {createEditPointView} from './view/edit-point-view';


const POINTS_VALUE = 3;

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');

const menuTemplate = createMenuView();
const filtersTemplate = createFiltersView();
const sortingTemplate = createSortingView();
const pointsListTemplate = createPointsListView();
const editPointTemplate = createEditPointView();
const pointTemplate = createPointView();


render(menuContainer, menuTemplate, RenderPosition.BEFOREEND);
render(filtersContainer, filtersTemplate, RenderPosition.BEFOREEND);
render(mainContainer, sortingTemplate, RenderPosition.BEFOREEND);
render(mainContainer, pointsListTemplate, RenderPosition.BEFOREEND);


const pointsListContainer = mainContainer.querySelector('.trip-events__list');

render(pointsListContainer, editPointTemplate, RenderPosition.BEFOREEND);
for (let i = 0; i < POINTS_VALUE; i++) {
  render(pointsListContainer, pointTemplate, RenderPosition.BEFOREEND);
}


