import StatsView from './view/stats-view';

import TripPresenter from './presenter/trip-presenter';
import FiltersPresenter from './presenter/filters-presenter';
import MenuPresenter from './presenter/menu-presenter';

import PointsModel from './model/points-model';
import FiltersModel from './model/filters-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import MenuModel from './model/menu-model';

import {MenuTab, RenderPosition} from './consts';
import {remove, render} from './utils/render-utils';

import ApiService from './api/api-service';


const AUTHORIZATION_KEY = 'Basic dif8f545ds08a';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

let statsComponent = null;

const api = new ApiService(END_POINT, AUTHORIZATION_KEY);

const pointsModel = new PointsModel(api);
const filtersModel = new FiltersModel();
const menuModel = new MenuModel();

const destinationsModel = new DestinationsModel(api);
const offersModel = new OffersModel(api);


Promise.all([destinationsModel.init(), offersModel.init()]).then(() => pointsModel.init());


const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');


const filtersPresenter = new FiltersPresenter(filtersContainer, filtersModel, pointsModel);
const menuPresenter = new MenuPresenter(menuModel, pointsModel, menuContainer, infoContainer, menuClickHandler);
const tripPresenter = new TripPresenter(mainContainer, pointsModel, filtersModel, destinationsModel, offersModel, filtersPresenter, menuPresenter);

tripPresenter.init();

function menuClickHandler (menuItem) {
  switch (menuItem) {
    case MenuTab.TABLE:
      remove(statsComponent);
      statsComponent = null;
      menuPresenter.enableAddButton();
      tripPresenter.init();
      break;
    case MenuTab.STATS:
      tripPresenter.remove();
      menuPresenter.disableAddButton();
      statsComponent = new StatsView(pointsModel.points);
      render(mainContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
}
