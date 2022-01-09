import dayjs from 'dayjs';
import {FAKE_NAMES, TYPES, TimeFormat, DefaultValue} from '../consts';
import {isInput} from '../utils/utils';
import {destinationsData, offersData} from '../mock/point';
import SmartView from './smart-view';


const isEditPoint = true; // TODO временно
const ValidationMessage = {
  NAME: 'Select a value from the list',
};


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
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" checked> <!--TODO При изменении типа точки маршрута выбранный ранее список дополнительных опций очищается.-->
      <label class="event__offer-label" for="event-offer-luggage-1"> <!--TODO изначально нужно будет сравнить offers полученные для точки и offers с сервера, здесь отражаем все + checked.-->
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`).join('')}
  </div>
</section>`;

const getPicturesTemplate = (pictures) => `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${pictures.map(({src, description}) => `<img class="event__photo" src=${src} alt=${description}>`).join('')}
  </div>
</div>`;

const getDescriptionTemplate = (description) => `<p class="event__destination-description">${description}</p>`;

const getDestinationTemplate = (descriptionTemplate, picturesTemplate) => `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${descriptionTemplate}
  ${picturesTemplate}
</section>`;

const getDestinationsListTemplate = (destinations) => `<datalist id="destination-list-1">
  ${destinations.map((destination) => `<option value=${destination}></option>`).join('')}
</datalist>`;


const createEditPointView = (point) => {
  const {price, dateFrom, dateTo, destination, offers, type, isOffers, isDescription, isPictures} = point;
  const {name, pictures, description} = destination;

  const eventTypeListTemplate = getEventTypeListTemplate(type);
  const timeTemplate = getTimeTemplate(dateFrom, dateTo);
  const editButtonsTemplate = getEditButtonGroupTemplate();
  const addButtonsTemplate = getAddButtonGroupTemplate();

  const offersTemplate = isOffers ? getOffersTemplate(offers) : '';
  const picturesTemplate = isPictures ? getPicturesTemplate(pictures) : '';
  const descriptionTemplate = isDescription ? getDescriptionTemplate(description): '';

  const destinationTemplate = isDescription || isPictures ? getDestinationTemplate(descriptionTemplate, picturesTemplate) : '';

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
          <input
            class="event__input event__input--destination"
            id="event-destination-1"
            type="text"
            name="event-destination"
            value='${name}'
            list="destination-list-1"
            autocomplete="off"
            required
          >
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


export default class EditPointView extends SmartView {

  constructor(point = DefaultValue.POINT) {
    super();
    this._state = EditPointView.parsePointToState(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createEditPointView(this._state);
  }

  setClickHandler = (cb) => {
    this._callbacks.closeClickHandler = cb;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#clickHandler);
  }

  setSubmitHandler = (cb) => {
    this._callbacks.submitFormHandler = cb;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitHandler);
  }

  setDeleteHandler = (cb) => {
    this._callbacks.deletePointHandler = cb;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteHandler);
  }

  reset = (point) => {
    this.updateState(
      EditPointView.parsePointToState(point),
    );
  }

  #clickHandler = () => this._callbacks.closeClickHandler();

  #submitHandler = (evt) => {
    evt.preventDefault();
    this._callbacks.submitFormHandler(EditPointView.parseStateToPoint(this._state));
  };

  #deleteHandler = () => {
    this._callbacks.deletePointHandler(EditPointView.parseStateToPoint(this._state));
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setSubmitHandler(this._callbacks.submitFormHandler);
    this.setClickHandler(this._callbacks.closeClickHandler);
  }

  #typeChangeHandler = (evt) => {
    if (!isInput(evt)) {
      return;
    }

    const typeValue = evt.target.value;
    const [offerWithType] = offersData.filter(({type}) => type === typeValue);

    const offers = offerWithType.offers;
    const isOffers = offers.length !== 0;

    this.updateState({
      type: typeValue,
      offers,
      isOffers,
    });
  }

  #destinationChangeHandler = (evt) => {
    if (!isInput(evt)) {
      return;
    }

    const nameValue = evt.target.value;
    const [destination] = destinationsData.filter(({name}) => name === nameValue);

    if (destination === undefined) {
      evt.target.setCustomValidity(ValidationMessage.NAME);
      return;
    }

    const description = destination.description;
    const pictures = destination.pictures;

    const isDescription = description.length !== 0;
    const isPictures = pictures.length !== 0;

    this.updateState({
      destination: {
        name: nameValue,
        description,
        pictures
      },
      isDescription,
      isPictures,
    });
  }

  static parsePointToState = (point) => ({
    ...point,
    isOffers: point.offers.length !== 0,
    isDescription: point.destination.description.length !== 0,
    isPictures: point.destination.pictures.length !== 0,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isOffers;
    delete point.isDescription;
    delete point.isPictures;

    return point;
  }
}
