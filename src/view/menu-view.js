import {MenuTab} from '../consts';

const menuTabsList = Object.values(MenuTab);


const createMenuView = (activeTab) => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
    ${menuTabsList.map((tab) => {
    const isActive = activeTab === tab ? 'trip-tabs__btn--active' : '';
    return `<a class="trip-tabs__btn ${isActive}" href="#">${tab}</a>`;}).join('')}
  </nav>`
);

export {createMenuView};
