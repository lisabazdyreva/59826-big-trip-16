const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const TimeFormat = {
  HOURS_MINUTES: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm',
  MONTH_DAY: 'MMM D',
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
};


export {RenderPosition, TYPES, TimeFormat};
