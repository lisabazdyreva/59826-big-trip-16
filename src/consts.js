const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const SortingTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};


const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const TimeFormat = {
  HOURS_MINUTES: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm',
  MONTH_DAY: 'MMM D',
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
};

const FAKE_NAMES = ['Toronto', 'Tokyo', 'Bursa', 'Bishkek', 'Torzhok', 'Tambov', 'Valencia', 'Warsaw','Dakar', 'Ottawa'];


export {RenderPosition, TYPES, TimeFormat, FAKE_NAMES, SortingTypes};
