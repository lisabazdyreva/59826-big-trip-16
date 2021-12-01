import dayjs from 'dayjs';
import {FAKE_NAMES, TYPES, TimeFormat} from '../consts';
import {createElement} from '../utils/utils';


const isEditPoint = true; // TODO временно


const getEditButtonGroupTemplate = () => `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
  <button class="event__reset-btn" type="reset">Delete</button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>`;

const getAddButtonGroupTemplate = () => `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
<button class="event__reset-btn" type="reset">Cancel</button>`;


const getEventTypeListTemplate = (activeType) => `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    ${TYPES.map((type) => {

    const typeText = type.slice(0, 1).toUpperCase() + type.slice(1);
    const isChecked = activeType === type ? 'checked' : '';

    return `<div class="event__type-item">
      <input
        id="event-type-${type}-1"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value='${type}'
        ${isChecked}
      >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
        ${typeText}
      </label>

    </div>`;}).join('')}

  </fieldset>
</div>`;


const getTimeTemplate = (dateFrom, dateTo) => {
  const from = dayjs(dateFrom).format(TimeFormat.DAYS_MONTHS_YEARS_TIME);
  const to = dayjs(dateTo).format(TimeFormat.DAYS_MONTHS_YEARS_TIME);

  return `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${from}'>
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${to}'>
  </div>`;
};


const getOffersTemplate = (offers) => `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${offers.map(({title, price}) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('')}
  </div>
</section>`;


const getPicturesTemplate = (pictures) => `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${pictures.map(({url, description}) => `<img class="event__photo" src=${url} alt=${description}>`).join('')}
  </div>
</div>`;


const getDestinationTemplate = (description, picturesTemplate) => {
  const isDescription = description ? `<p class="event__destination-description">${description}</p>` : '';

  return `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    ${isDescription}
    ${picturesTemplate}
  </section>`;
};


const getDestinationsListTemplate = (destinations) => `<datalist id="destination-list-1">
  ${destinations.map((destination) => `<option value=${destination}></option>`)}
</datalist>`;


const createEditPointView = (point = {}) => {
  const {
    price = '',
    dateFrom = dayjs(),
    dateTo = dayjs(),
    destination = {name: '', pictures: [], description: ''},
    offers = [],
    type = TYPES[0]
  } = point;
  const {name, pictures, description} = destination;

  const eventTypeListTemplate = getEventTypeListTemplate(type);
  const timeTemplate = getTimeTemplate(dateFrom, dateTo);
  const editButtonsTemplate = getEditButtonGroupTemplate();
  const addButtonsTemplate = getAddButtonGroupTemplate();

  const offersTemplate = offers.length ? getOffersTemplate(offers) : '';
  const picturesTemplate = pictures.length ? getPicturesTemplate(pictures) : '';
  const destinationTemplate = description || pictures.length ? getDestinationTemplate(description, picturesTemplate) : '';

  const destinationsListTemplate = getDestinationsListTemplate(FAKE_NAMES);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${eventTypeListTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input event__input--destination" id="event-destination-1" type="text" name="event-destination" value='${name}' list="destination-list-1">
          ${destinationsListTemplate}
        </div>

        ${timeTemplate}

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value='${price}'>
        </div>

        ${isEditPoint ? editButtonsTemplate : addButtonsTemplate}

      </header>

      <section class="event__details">
        ${offersTemplate}
        ${destinationTemplate}
      </section>
    </form>
  </li>`;
};

export default class EditPointView {
  #element = null;
  #point;

  constructor(point) {
    this.#point = point;
  }

  get template() {
    return createEditPointView(this.#point);
  }

  get element() {
    if(!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
