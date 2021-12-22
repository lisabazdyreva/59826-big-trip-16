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

const TAG_INPUT = 'INPUT';

const getFormattedDuration = (difference) => { // TODO мб улучшить можно будет со временем
  if (difference < TimeConverter.MINUTES_IN_HOUR) {
    return `${difference}${TimeUnit.MINUTES}`;
  }

  if (TimeConverter.MINUTES_IN_HOUR < difference && difference < TimeConverter.MINUTES_IN_DAY) {
    const hours = Math.floor(difference / TimeConverter.MINUTES_IN_HOUR);
    const minutes = difference - (hours * TimeConverter.MINUTES_IN_HOUR);

    return `${hours}${TimeUnit.HOURS} ${minutes}${TimeUnit.MINUTES}`;
  }

  if (TimeConverter.MINUTES_IN_DAY < difference) {
    const days = Math.floor(difference / TimeConverter.MINUTES_IN_DAY);
    const hours = Math.floor((difference - days * TimeConverter.MINUTES_IN_DAY) / TimeConverter.MINUTES_IN_HOUR);
    const minutes = (difference - days * TimeConverter.MINUTES_IN_DAY) - (hours * TimeConverter.MINUTES_IN_HOUR);

    return `${days}${TimeUnit.DAYS} ${hours}${TimeUnit.HOURS} ${minutes}${TimeUnit.MINUTES}`;
  }
};

const createElement = (template) => {
  const emptyElement = document.createElement('div');
  emptyElement.innerHTML = template;
  return emptyElement.firstElementChild;
};

const isEsc = (key) => key === 'Esc' || key === 'Escape';

const isInput = (evt) => evt.target.tagName === TAG_INPUT;

const updateItem = (items, updatingItem) => {
  const index = items.findIndex((item) => item.id === updatingItem.id);
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatingItem,
    ...items.slice(index + 1),
  ];
};

const sortByFromDate = (pointA, pointB) => pointA.dateFrom - pointB.dateFrom;

const sortByDuration = (pointA, pointB) => {
  const durationA = pointA.dateTo - pointA.dateFrom;
  const durationB = pointB.dateTo - pointB.dateFrom;

  return durationB - durationA;
};

const sortByPrice = (pointA, pointB) => pointB.price - pointA.price;


export {getFormattedDuration, createElement, isEsc, isInput, updateItem, sortByFromDate, sortByDuration, sortByPrice};
