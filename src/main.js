import {render} from './utils/render-utils';
import {DefaultValue, RenderPosition} from './consts';

import {getPoint} from './mock/point';

import TripPresenter from './presenter/trip-presenter';

import MenuView from './view/menu-view';
import FiltersView from './view/filters-view';


const PointsValue = {
  FULL: 15,
  EMPTY: 0,
};

const data = Array.from({length: PointsValue.FULL}, getPoint);

const menuComponent = new MenuView(DefaultValue.MENU);
const filtersComponent = new FiltersView(DefaultValue.FILTER);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');


const tripPresenter = new TripPresenter(mainContainer, infoContainer);

render(menuContainer, menuComponent, RenderPosition.BEFOREEND);
render(filtersContainer, filtersComponent, RenderPosition.BEFOREEND);


tripPresenter.init(data);
