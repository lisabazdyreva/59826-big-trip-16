import dayjs from 'dayjs';
import {TimeFormat, DefaultValue, ValidationMessage} from '../consts';
import {getDatepickerConfig, isInput} from '../utils/utils';
import SmartView from './smart-view';

import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const getEventTypeListTemplate = (activeType, types) => `<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

    ${types.map((type) => {

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

const getOffersTemplate = (offers, offersList, isEditPoint) => `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${offersList.map(({title, price}) => {
    const attr = title.split(' ').map((word) => word.toLowerCase()).join('-');
    const isChecked = (offers.filter((offer) => offer.title === title).length) && isEditPoint ? 'checked' : '';

    return `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${attr}-1"
          type="checkbox"
          name="event-offer-${attr}"
          value="${title}"
          ${isChecked}
        />
        <label class="event__offer-label" for="event-offer-${attr}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
        </div>`;
  }).join('')}
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
  ${destinations.map((destination) => `<option value='${destination}'></option>`).join('')}
</datalist>`;


const createEditPointView = (point, isEditPoint, destinationsList, offersList, types, names) => {

  const {price, dateFrom, dateTo, destination, offers, type, isOffers, isDescription, isDisabled, isDeleting, isSaving,  isPictures} = point;
  const {name, pictures, description} = destination;

  const eventTypeListTemplate = getEventTypeListTemplate(type, types);
  const timeTemplate = getTimeTemplate(dateFrom, dateTo);

  const offersTemplate = (isOffers || offersList.length) ? getOffersTemplate(offers, offersList, isEditPoint) : '';
  const picturesTemplate = isPictures ? getPicturesTemplate(pictures) : '';
  const descriptionTemplate = isDescription ? getDescriptionTemplate(description): '';

  const destinationTemplate = isDescription || isPictures ? getDestinationTemplate(descriptionTemplate, picturesTemplate) : '';
  const destinationsListTemplate = getDestinationsListTemplate(names);

  const buttonResetText = () => {
    if (isEditPoint && isDeleting) {
      return 'Deleting';
    }

    if (!isEditPoint) {
      return 'Cancel';
    }

    return 'Delete';
  };

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${type ? `<img class="event__type-icon" width="17" height="17" src='img/icons/${type}.png' alt="Event type icon">` : ''}
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value='${price}'>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${buttonResetText()}</button>
        ${isEditPoint ? `<button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>`: ''}

      </header>

      <section class="event__details">
        ${offersTemplate}
        ${destinationTemplate}
      </section>
    </form>
  </li>`;
};


export default class EditPointView extends SmartView {
  #isEditPoint = null;
  #type = null;

  #destinationsList = null;
  #offersList = null;
  #types = null;
  #names = null;

  #datepickerFrom = null;
  #datepickerTo = null;

  constructor(point, destinationsList, offersList, types, names) {
    super();
    this._state = EditPointView.parsePointToState(point);
    this.#type = this._state.type;

    this.#isEditPoint = point !== DefaultValue.POINT;

    this.#destinationsList = destinationsList;
    this.#offersList = offersList;
    this.#types = types;
    this.#names = names;

    this.#setInnerHandlers();
  }

  get offers() {
    if (this.#type) { // TODO придуматься что-то получше
      const [offerWithType] = this.#offersList.filter(({type}) => type === this.#type);
      return offerWithType.offers;
    }
    return [];
  }

  get template() {
    return createEditPointView(this._state, this.#isEditPoint, this.#destinationsList, this.offers, this.#types, this.#names);
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
    this.updateStateWithRerender(
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
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);

    const offersElement = this.element.querySelector('.event__section--offers');

    if (offersElement !== null) {
      offersElement.addEventListener('click', this.#offersClickHandler);
    }

    this.#setDatepickers();
  }

  #setDatepickers = () => {
    this.#setDatepickerFrom();
    this.#setDatePickerTo();
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }

    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();

    this.setSubmitHandler(this._callbacks.submitFormHandler);
    this.setDeleteHandler(this._callbacks.deletePointHandler);

    if (this.#isEditPoint) {
      this.setClickHandler(this._callbacks.closeClickHandler);
    }
  }

  #typeChangeHandler = (evt) => {
    if (!isInput(evt)) {
      return;
    }

    this.#type = evt.target.value;

    this.updateStateWithRerender({
      type: this.#type,
      offers: [],
      isOffers: !!this.offers.length,
    });
  }

  #priceInputHandler = (evt) => {
    const price = Number(evt.target.value);
    const isIncorrect = price <= 0;

    if (isIncorrect) {
      evt.target.setCustomValidity(ValidationMessage.PRICE);
      return;
    }

    evt.target.setCustomValidity('');
    this.updateState({price});
  }

  #destinationChangeHandler = (evt) => {
    if (!isInput(evt)) {
      return;
    }

    const nameValue = evt.target.value;
    const [destination] = this.#destinationsList.filter(({name}) => name === nameValue);

    if (destination === undefined) {
      evt.target.setCustomValidity(ValidationMessage.NAME);
      return;
    }

    const description = destination.description;
    const pictures = destination.pictures;

    const isDescription = description.length !== 0;
    const isPictures = pictures.length !== 0;

    this.updateStateWithRerender({
      destination: {
        name: nameValue,
        description,
        pictures
      },
      isDescription,
      isPictures,
    });
  }

  #offersClickHandler = (evt) => {
    if (!isInput(evt)) {
      return;
    }

    const [offer] = this.offers.filter(({title}) => title === evt.target.value);


    if (evt.target.checked) {
      this.updateState({
        offers: [...this._state.offers, offer],
      });
    }

    if (!evt.target.checked) {
      this.updateState({
        offers: this._state.offers.filter(({id}) => id !== offer.id),
      });
    }
  }

  #setDatepickerFrom = () => {
    const config = {...getDatepickerConfig(this.#dateFromClickHandler), maxDate: this._state.dateTo.toDate()};
    this.#datepickerFrom = flatpickr(this.element.querySelector('#event-start-time-1'), config);
  }

  #setDatePickerTo = () => {
    const config = {...getDatepickerConfig(this.#dateToClickHandler), minDate: this._state.dateFrom.toDate()};
    this.#datepickerTo = flatpickr(this.element.querySelector('#event-end-time-1'), config);

  }

  #dateFromClickHandler = ([userDateFrom]) => {
    this.updateStateWithRerender({
      dateFrom: dayjs(userDateFrom),
    });
    this.#datepickerFrom.open();
  }

  #dateToClickHandler = ([userDateTo]) => {
    this.updateStateWithRerender({
      dateTo: dayjs(userDateTo),
    });
    this.#datepickerTo.open();
  }

  disableInputs = () => {
    this.element.querySelectorAll('input').forEach((elem) => {
      elem.disabled = true;
    });
  }


  static parsePointToState = (point) => ({
    ...point,
    isOffers: point.offers.length !== 0,
    isDescription: point.destination.description.length !== 0,
    isPictures: point.destination.pictures.length !== 0,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isOffers;
    delete point.isDescription;
    delete point.isPictures;

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
