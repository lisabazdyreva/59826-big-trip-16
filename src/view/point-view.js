import AbstractView from './abstract-view';

import {TimeFormat, MINUTE} from '../consts';
import {getFormattedDate, getFormattedDuration} from '../utils/utils';

import dayjs from 'dayjs';


const getOffersTemplate = (offers) => `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map(({title, price}) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>`).join('')}
</ul>`;

const getScheduleTemplate = (from, to, difference) => {
  const timeFrom = getFormattedDate(from, TimeFormat.HOURS_MINUTES);
  const timeTo = getFormattedDate(to, TimeFormat.HOURS_MINUTES);

  const attrFrom = getFormattedDate(from, TimeFormat.ISO);
  const attrTo = getFormattedDate(to, TimeFormat.ISO);

  const duration = getFormattedDuration(difference);

  return `<div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime=${attrFrom}>${timeFrom}</time>
      &mdash;
      <time class="event__end-time" datetime=${attrTo}>${timeTo}</time>
    </p>
    <p class="event__duration">${duration}</p>
  </div>`;
};

const getEventDateTemplate = (from) => {
  const date = getFormattedDate(from, TimeFormat.MONTH_DAY);
  const attrDate = getFormattedDate(from, TimeFormat.YEAR_MONTH_DAY);

  return `<time class="event__date" datetime="${attrDate}">${date}</time>`;
};


const createPointView = (point) => {
  const {price, dateFrom, dateTo, destination, isFavorite, offers, type} = point;
  const {name} = destination;

  const buttonFavoriteClasses = isFavorite ? 'event__favorite-btn--active' : '';

  const offersTemplate = offers.length ? getOffersTemplate(offers) : '';

  const from = dateFrom !== null ? dayjs(dateFrom) : '';
  const to = dateTo !== null ? dayjs(dateTo) : '';
  const difference = dayjs(dateTo).diff(dateFrom, MINUTE);

  const scheduleTemplate = getScheduleTemplate(from, to, difference);
  const fromDateTemplate = getEventDateTemplate(from);

  return `<li class="trip-events__item">
    <div class="event">
      ${fromDateTemplate}
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event ${type} icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      ${scheduleTemplate}
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${offersTemplate}
      <button class="event__favorite-btn ${buttonFavoriteClasses}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};


export default class PointView extends AbstractView {
  #point = null;

  constructor(point) {
    super();
    this.#point = point;
  }

  get template() {
    return createPointView(this.#point);
  }

  setButtonOpenClickHandler = (cb) => {
    this._callbacks.buttonOpenClickHandler = cb;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonOpenClickHandler);
  }

  setFavoriteClickHandler = (cb) => {
    this._callbacks.favoriteToggleHandler = cb;
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteToggleHandler);
  }

  #buttonOpenClickHandler = () => {
    this._callbacks.buttonOpenClickHandler();
  }

  #favoriteToggleHandler = () => {
    this._callbacks.favoriteToggleHandler();
  }
}
