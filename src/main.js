import {remove, render} from './utils/render-utils';
import {DefaultValue, MenuTab, RenderPosition} from './consts';


import TripPresenter from './presenter/trip-presenter';
import FiltersPresenter from './presenter/filters-presenter';

import PointsModel from './model/points-model';

import MenuView from './view/menu-view';
import FiltersModel from './model/filters-model';

import ApiService from './api/api-service';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import StatsView from './view/stats-view';

const AUTHORIZATION_KEY = 'Basic difg537hffs08a';
const END_POINT = 'https://16.ecmascript.pages.academy/big-trip';

const api = new ApiService(END_POINT, AUTHORIZATION_KEY);

const pointsModel = new PointsModel(api);
const destinationsModel = new DestinationsModel(api);
const offersModel = new OffersModel(api);
const filtersModel = new FiltersModel();


Promise.all([destinationsModel.init(), offersModel.init()]).then(() => pointsModel.init());


const menuComponent = new MenuView(DefaultValue.MENU);
let statsComponent = null;

const menuContainer = document.querySelector('.trip-controls__navigation');
const filtersContainer = document.querySelector('.trip-controls__filters');
const mainContainer = document.querySelector('.trip-events');
const infoContainer = document.querySelector('.trip-main');

render(menuContainer, menuComponent, RenderPosition.BEFOREEND);

const filtersPresenter = new FiltersPresenter(filtersContainer, filtersModel);
const tripPresenter = new TripPresenter(mainContainer, infoContainer, pointsModel, filtersModel, destinationsModel, offersModel, filtersPresenter);

tripPresenter.init();
const addButtonElement = document.querySelector('.trip-main__event-add-btn');

addButtonElement.addEventListener('click', () => tripPresenter.createPoint());

const menuClickHandler = (menuItem) => {
  switch (menuItem) {
    case MenuTab.TABLE:
      remove(statsComponent);
      statsComponent = null;
      addButtonElement.disabled = false;
      tripPresenter.init(); // TODO info оставлять
      break;
    case MenuTab.STATS:
      tripPresenter.remove();
      addButtonElement.disabled = true;
      statsComponent = new StatsView();
      render(mainContainer, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

menuComponent.setMenuClickHandler(menuClickHandler);
