import {MenuTab} from '../consts';

const menuTabsList = Object.values(MenuTab);

const createMenuView = (activeTab) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuTabsList.map((tab) => `<a class="trip-tabs__btn ${activeTab === tab ? 'trip-tabs__btn--active' : ''}" href="#">${tab}</a>`).join('')}
  </nav>`
);

export {createMenuView};
