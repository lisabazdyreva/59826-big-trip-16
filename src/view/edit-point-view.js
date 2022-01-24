import SmartView from './smart-view';

import {TimeFormat, DefaultValue, ValidationMessage} from '../consts';
import {getDatepickerConfig, getFormattedDate, isInput} from '../utils/utils';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const ButtonText = {
  DELETE: 'Delete',
  DELETING: 'Deleting',
  CANCEL: 'Cancel',
  SAVE: 'Save',
  SAVING: 'Saving',
};


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
        value="${type}"
        ${isChecked}
      >
      <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">
        ${typeText}
      </label>
    </div>`;}).join('')}

  </fieldset>
</div>`;

const getTimeTemplate = (dateFrom, dateTo) => {
  const from = getFormattedDate(dateFrom, TimeFormat.DAYS_MONTHS_YEARS_TIME);
  const to = getFormattedDate(dateTo, TimeFormat.DAYS_MONTHS_YEARS_TIME);

  return `<div class="event__field-group  event__field-group--time">
    <label class="visually-hidden" for="event-start-time-1">From</label>
    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${from}">
    &mdash;
    <label class="visually-hidden" for="event-end-time-1">To</label>
    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${to}">
  </div>`;
};

const getOffersTemplate = (offers, offersList, isEditPoint) => `<section class="event__section  event__section--offers">
  <h3 class="event__section-title  event__section-title--offers">Offers</h3>
  <div class="event__available-offers">
    ${offersList.map(({title, price}) => {
    const value = title.split(' ').map((word) => word.toLowerCase()).join('-');
    const isChecked = (offers.filter((offer) => offer.title === title).length) && isEditPoint ? 'checked' : '';

    return `<div class="event__offer-selector">
        <input
          class="event__offer-checkbox  visually-hidden"
          id="event-offer-${value}-1"
          type="checkbox"
          name="event-offer-${value}"
          value="${title}"
          ${isChecked}
        />
        <label class="event__offer-label" for="event-offer-${value}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
    </div>`;}).join('')}
  </div>
</section>`;

const getPicturesTemplate = (pictures) => `<div class="event__photos-container">
  <div class="event__photos-tape">
    ${pictures.map(({src, description}) => `<img class="event__photo" src=${src} alt="${description}">`).join('')}
  </div>
</div>`;

const getDescriptionTemplate = (description) => `<p class="event__destination-description">${description}</p>`;

const getDestinationTemplate = (descriptionTemplate, picturesTemplate) => `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  ${descriptionTemplate}
  ${picturesTemplate}
</section>`;

const getDestinationsListTemplate = (destinations) => `<datalist id="destination-list-1">
  ${destinations.map((destination) => `<option value="${destination}"></option>`).join('')}
</datalist>`;


const createEditPointView = (point, isEditPoint, destinationsList, offersList, types, names) => {
  const {
    price,
    dateFrom,
    dateTo,
    destination,
    offers,
    type,
    isOffers,
    isDescription,
    isDisabled,
    isDeleting,
    isSaving,
    isPictures
  } = point;
  const {name, pictures, description} = destination;

  const isAnyOffers = isOffers || offersList.length;
  const isDestination = isDescription || isPictures;

  const isButtonSaving = isSaving ? ButtonText.SAVING : ButtonText.SAVE;
  const isDisabledButton= isDisabled ? 'disabled' : '';

  const eventTypeListTemplate = getEventTypeListTemplate(type, types);
  const timeTemplate = getTimeTemplate(dateFrom, dateTo);

  const offersTemplate = isAnyOffers ? getOffersTemplate(offers, offersList, isEditPoint) : '';
  const picturesTemplate = isPictures ? getPicturesTemplate(pictures) : '';
  const descriptionTemplate = isDescription ? getDescriptionTemplate(description): '';

  const destinationTemplate = isDestination ? getDestinationTemplate(descriptionTemplate, picturesTemplate) : '';
  const destinationsListTemplate = getDestinationsListTemplate(names);

  const getButtonResetText = () => {
    if (isEditPoint && isDeleting) {
      return ButtonText.DELETING;
    }

    if (!isEditPoint) {
      return ButtonText.CANCEL;
    }

    return ButtonText.DELETE;
  };
  const buttonResetText = getButtonResetText();


  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            ${type ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="${type} icon">` : ''}
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
            value="${name}"
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
          <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}" autocomplete="off">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabledButton}>${isButtonSaving}</button>
        <button class="event__reset-btn" type="reset" ${isDisabledButton}>${buttonResetText}</button>
        ${isEditPoint ? `<button class="event__rollup-btn" type="button" ${isDisabledButton}><span class="visually-hidden">Open event</span></button>`: ''}

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
    if (this.#type) {
      const [offersWithType] = this.#offersList.filter(({type}) => type === this.#type);
      return offersWithType.offers;
    }
    return [];
  }

  get template() {
    return createEditPointView(this._state, this.#isEditPoint, this.#destinationsList, this.offers, this.#types, this.#names);
  }

  setCloseButtonClickHandler = (cb) => {
    this._callbacks.buttonCloseClickHandler = cb;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#buttonCloseClickHandler);
  }

  setSubmitHandler = (cb) => {
    this._callbacks.formSubmitHandler = cb;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  }

  setButtonDeleteClickHandler = (cb) => {
    this._callbacks.buttonDeleteClickHandler = cb;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#buttonDeleteClickHandler);
  }

  reset = (point) => {
    this.updateStateWithRerender(
      EditPointView.parsePointToState(point),
    );
  }

  #buttonCloseClickHandler = () => {
    this._callbacks.buttonCloseClickHandler();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callbacks.formSubmitHandler(EditPointView.parseStateToPoint(this._state));
  };

  #buttonDeleteClickHandler = () => {
    this._callbacks.buttonDeleteClickHandler(EditPointView.parseStateToPoint(this._state));
  }

  #setInnerHandlers = () => {
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__type-group').addEventListener('click', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.#setOffersEventListener();

    this.#setDatepickers();
  }

  #setOffersEventListener = () => {
    const offersElement = this.element.querySelector('.event__section--offers');

    if (offersElement !== null) {
      offersElement.addEventListener('click', this.#offerClickHandler);
    }
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

    this.setSubmitHandler(this._callbacks.formSubmitHandler);
    this.setButtonDeleteClickHandler(this._callbacks.buttonDeleteClickHandler);

    if (this.#isEditPoint) {
      this.setCloseButtonClickHandler(this._callbacks.buttonCloseClickHandler);
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
    const isIncorrect = (price <= 0) || (!Number.isInteger(price));

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

  #offerClickHandler = (evt) => {
    if (!isInput(evt)) {
      return;
    }

    const [offer] = this.offers.filter(({title}) => title === evt.target.value);
    const isChecked = evt.target.checked;

    if (isChecked) {
      this.updateState({
        offers: [...this._state.offers, offer]
      });
      return;
    }

    this.updateState({
      offers: this._state.offers.filter(({id}) => id !== offer.id),
    });
  }

  #setDatepickerFrom = () => {
    const maxDate = this._state.dateTo.toDate();

    const config = {...getDatepickerConfig(this.#dateFromClickHandler), maxDate};
    this.#datepickerFrom = flatpickr(this.element.querySelector('#event-start-time-1'), config);
  }

  #setDatePickerTo = () => {
    const minDate = this._state.dateFrom.toDate();

    const config = {...getDatepickerConfig(this.#dateToClickHandler), minDate};
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
    this.element.querySelectorAll('input').forEach((element) => {
      element.disabled = true;
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
