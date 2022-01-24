import {FiltersType, SortingType} from '../consts';
import dayjs from 'dayjs';


const TimeConverter = {
  MINUTES_IN_HOUR: 60,
  MINUTES_IN_DAY: 1440,
  HOURS_IN_DAY: 24,
};

const TimeUnit = {
  MINUTES: 'M',
  HOURS: 'H',
  DAYS: 'D',
};

const DATE_FORMAT_DATEPICKER = 'd/m/y H:i';

const TAG_INPUT = 'INPUT';

const currentDate = dayjs();

const formatTime = (time) => time < 10 ? `0${time}`: time;

const getFormattedDate = (date, format) => dayjs(date).format(format);

const getFormattedDuration = (difference) => {
  if (difference < TimeConverter.MINUTES_IN_HOUR) {
    return `${formatTime(difference)}${TimeUnit.MINUTES}`;
  }

  if (TimeConverter.MINUTES_IN_HOUR < difference && difference < TimeConverter.MINUTES_IN_DAY) {
    const hours = Math.floor(difference / TimeConverter.MINUTES_IN_HOUR);
    const minutes = difference - (hours * TimeConverter.MINUTES_IN_HOUR);

    return `${formatTime(hours)}${TimeUnit.HOURS} ${formatTime(minutes)}${TimeUnit.MINUTES}`;
  }

  if (TimeConverter.MINUTES_IN_DAY <= difference) {
    const days = Math.floor(difference / TimeConverter.MINUTES_IN_DAY);
    const hours = Math.floor((difference - days * TimeConverter.MINUTES_IN_DAY) / TimeConverter.MINUTES_IN_HOUR);
    const minutes = (difference - days * TimeConverter.MINUTES_IN_DAY) - (hours * TimeConverter.MINUTES_IN_HOUR);

    return `${formatTime(days)}${TimeUnit.DAYS} ${formatTime(hours)}${TimeUnit.HOURS} ${formatTime(minutes)}${TimeUnit.MINUTES}`;
  }
};

const createElement = (template) => {
  const emptyElement = document.createElement('div');
  emptyElement.innerHTML = template;
  return emptyElement.firstElementChild;
};

const isEsc = (key) => key === 'Esc' || key === 'Escape';

const isInput = (evt) => evt.target.tagName === TAG_INPUT;

const sortByFromDate = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;

const sortByDuration = (pointA, pointB) => {
  const durationA = pointA.dateTo - pointA.dateFrom;
  const durationB = pointB.dateTo - pointB.dateFrom;

  return durationB - durationA;
};

const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;


const filterFuture = (points) => points.filter((point) => point.dateFrom >= currentDate || (point.dateFrom < currentDate && point.dateTo > currentDate));
const filterPast = (points) => points.filter((point) => point.dateTo < currentDate || (point.dateFrom < currentDate && point.dateTo > currentDate));

const filterPoints = {
  [FiltersType.EVERYTHING]: (points) => points,
  [FiltersType.FUTURE]: filterFuture,
  [FiltersType.PAST]: filterPast,
};

const sortPoints = (type, points) => {
  switch (type) {
    case SortingType.DAY:
      return points.sort(sortByFromDate);
    case SortingType.TIME:
      return points.sort(sortByDuration);
    case SortingType.PRICE:
      return points.sort(sortByPrice);
  }
  return points;
};

const getDatepickerConfig = (handler) => ({
  dateFormat: DATE_FORMAT_DATEPICKER,
  enableTime: true,
  'time_24hr': true,
  onChange: handler,
});

const checkMinorUpdate = (pointAfterUpdate, pointBeforeUpdate) => pointAfterUpdate.dateTo.diff(pointBeforeUpdate.dateTo) !== 0
  || pointAfterUpdate.dateFrom.diff(pointBeforeUpdate.dateFrom) !== 0
  || pointAfterUpdate.price !== pointBeforeUpdate.price;


export {
  getFormattedDuration,
  getFormattedDate,
  createElement,
  isEsc,
  isInput,
  sortByFromDate,
  sortByDuration,
  sortByPrice,
  filterPoints,
  sortPoints,
  getDatepickerConfig,
  checkMinorUpdate
};
