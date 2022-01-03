import {render} from './utils/render-utils';
import {DefaultValue, RenderPosition} from './consts';

import {getPoint} from './mock/point';

import TripPresenter from './presenter/trip-presenter';
import FiltersPresenter from './presenter/filters-presenter';

import PointsModel from './model/points-model';

import MenuView from './view/menu-view';
import FiltersModel from './model/filters-model';


const PointsValue = {
  FULL: 15,
  EMPTY: 0,
};

const data = Array.from({length: PointsValue.FULL}, getPoint);

const pointsModel = new PointsModel();
pointsModel.points = data;

const filtersModel = new FiltersModel();
filtersModel.activeFilter = DefaultValue.FILTER;

const menuComponent = new MenuView(DefaultValue.MENU);

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');


const tripPresenter = new TripPresenter(mainContainer, infoContainer, pointsModel);
const filtersPresenter = new FiltersPresenter(filtersContainer, filtersModel);

render(menuContainer, menuComponent, RenderPosition.BEFOREEND);

filtersPresenter.init();
tripPresenter.init();
