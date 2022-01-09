import dayjs from 'dayjs';

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

const FiltersType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const NoFilteredPointsMessage = {
  [FiltersType.EVERYTHING]: 'Click New Event to create your first point',
  [FiltersType.PAST]: 'There are no past events now',
  [FiltersType.FUTURE]: 'There are no future events now',
};

const MenuTab = {
  TABLE: 'Table',
  STATS: 'Stats',
};

const TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];

const DefaultValue = {
  SORTING: SortingType.DAY,
  FILTER: FiltersType.EVERYTHING,
  MENU: MenuTab.TABLE,
  POINT: {
    price: '',
    dateFrom: dayjs(),
    dateTo: dayjs(),
    destination : {
      name: '',
      pictures: [],
      description: '',
    },
    offers: [],
    type: '',
  },
  NOTIFICATION: NoFilteredPointsMessage[FiltersType.EVERYTHING],
};

const TimeFormat = {
  HOURS_MINUTES: 'HH:mm',
  ISO: 'YYYY-MM-DDTHH:mm',
  MONTH_DAY: 'MMM D',
  DAY: 'D',
  YEAR_MONTH_DAY: 'YYYY-MM-DD',
  DAYS_MONTHS_YEARS_TIME: 'DD/MM/YY HH:mm',
};

const FAKE_NAMES = ['Toronto', 'Tokyo', 'Bursa', 'Bishkek', 'Torzhok', 'Tambov', 'Valencia', 'Warsaw','Dakar', 'Ottawa'];

const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

const ErrorMessage = {
  METHOD : 'Method implementation is not available in abstract class',
  GETTER : 'Getter implementation is not available in abstract class',
  INSTANT: 'Abstract class is not for instantiation',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const UserPointAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};


export {
  RenderPosition,
  TYPES,
  TimeFormat,
  FAKE_NAMES,
  SortingType,
  MenuTab,
  DefaultValue,
  Mode,
  ErrorMessage,
  UpdateType,
  UserPointAction,
  FiltersType,
  NoFilteredPointsMessage
};
