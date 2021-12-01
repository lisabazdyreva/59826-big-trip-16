import {RenderPosition} from '../consts';

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

const render = (container, element, position) => {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREBEGIN:
      container.before(element);
      break;
    case RenderPosition.AFTEREND:
      container.after(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    default:
      container.append(element);
      break;
  }
};

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

const replaceChild = (to, from, container) => {
  container.replaceChild(to, from);
};

const isEsc = (key) => {
  return key === 'Esc' || key === 'Escape';
};

export {render, getFormattedDuration, createElement, replaceChild, isEsc};
