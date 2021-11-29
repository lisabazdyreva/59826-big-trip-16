const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const SortingType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

const FilterValue = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuTab = {
  TABLE: 'Table',
  STATS: 'Stats',
};

const DefaultValue = {
  SORTING: SortingType.DAY,
  FILTER: FilterValue.EVERYTHING,
  MENU: MenuTab.TABLE,
};

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const TimeFormat = {
  HOURS_MINUTES: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm',
  MONTH_DAY: 'MMM D',
  DAY: 'D',
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
  DAYS_MONTHS_YEARS_TIME: 'DD/MM/YY HH:mm',
};

const FAKE_NAMES = ['Toronto', 'Tokyo', 'Bursa', 'Bishkek', 'Torzhok', 'Tambov', 'Valencia', 'Warsaw','Dakar', 'Ottawa'];


export {RenderPosition, TYPES, TimeFormat, FAKE_NAMES, SortingType, FilterValue, MenuTab, DefaultValue};
