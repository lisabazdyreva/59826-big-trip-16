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

const render = (container, template, position, isNew = false) => {
  if(isNew) {
    switch (position) {
      case (RenderPosition.AFTERBEGIN):
        container.prepend(template);
        break;
      default:
        container.append(template);
        break;
    }

  } else {
    container.insertAdjacentHTML(position, template);
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

export {render, getFormattedDuration, createElement};
