import {SortingType} from '../consts';

const sortingTypesList = Object.values(SortingType);

const createSortingView = (activeSortingType) => (
  `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortingTypesList.map((type) => {
    const isChecked = activeSortingType === type ? 'checked' : '';
    const isDisabled = SortingType.EVENT === type || SortingType.OFFERS === type ? 'disabled' : '';

    return `<div class="trip-sort__item  trip-sort__item--${type}">
      <input
        id="sort-${type}"
        class="trip-sort__input  visually-hidden"
        type="radio"
        name="trip-sort"
        value="sort-${type}"
        ${isChecked}
        ${isDisabled}
      >
      <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;}).join('')}
  </form>`
);

export {createSortingView};
