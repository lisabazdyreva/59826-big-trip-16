import dayjs from 'dayjs';
import {getFormattedDuration} from '../utils/utils';
import {TimeFormat} from '../consts';
import AbstractView from './abstract-view';


const getOffersTemplate = (offers) => `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${offers.map(({title, price}) => `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>`)}
  </ul>`;


const getScheduleTemplate = (from, to, difference) => {
  const timeFrom = `${from.format(TimeFormat.HOURS_MINUTES)}`;
  const timeTo = `${to.format(TimeFormat.HOURS_MINUTES)}`;

  const attrFrom = `${from.format(TimeFormat.ISO)}`;
  const attrTo = `${to.format(TimeFormat.ISO)}`;

  const duration = getFormattedDuration(difference) ;

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
  const date = from.format(TimeFormat.MONTH_DAY);
  const attrDate = from.format(TimeFormat.YEAR_MONTH_DAY);

  return `<time class="event__date" datetime=${attrDate}>${date}</time>`;
};


const createPointView = (point) => {
  const {price, dateFrom, dateTo, destination, isFavorite, offers, type} = point;
  const {name} = destination;

  const buttonClasses = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = offers.length ? getOffersTemplate(offers) : '';

  const from = (dateFrom !== null) ? dayjs(dateFrom) : '';
  const to = (dateTo !== null) ? dayjs(dateTo) : '';
  const difference = dayjs(dateTo).diff(dateFrom, 'minute');
  const scheduleTemplate = getScheduleTemplate(from, to, difference);
  const fromDateTemplate = getEventDateTemplate(from);

  return `<li class="trip-events__item">
    <div class="event">
      ${fromDateTemplate}
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${name}</h3>
      ${scheduleTemplate}
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      ${offersTemplate}
      <button class="event__favorite-btn ${buttonClasses}" type="button">
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
}
