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
    isFavorite: false,
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


const Mode = {
  DEFAULT: 'DEFAULT',
  EDIT: 'EDIT',
};

const ErrorMessage = {
  METHOD : 'Method implementation is not available in abstract class',
  GETTER : 'Getter implementation is not available in abstract class',
  INSTANT: 'Abstract class is not for instantiation',
};

const ResponseErrorMessage = {
  UPDATE: 'Can\'t update the point right now.',
  ADD: 'Can\'t add the point right now.',
  REMOVE: 'Can\'t remove the point right now.',
};

const ValidationMessage = {
  NAME: 'Select a value from the list',
  PRICE: 'The price cannot be zero, float or less than zero. Please fill the field correctly.',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  OFFERS_DOWNLOADED: 'DOWNLOADED_OFFERS',
  DESTINATIONS_DOWNLOADED: 'DOWNLOADED_DESTINATIONS',
};

const UserPointAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

const ChartName = {
  MONEY: 'MONEY',
  TYPE: 'TYPE',
  TIME: 'TIME',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTING: 'ABORTING',
};

const RenderErrorMessage = {
  REPLACE: 'Can\'t replace empty elements',
  REMOVE: 'Can remove only components',
};


export {
  ChartName,
  RenderPosition,
  TimeFormat,
  SortingType,
  MenuTab,
  DefaultValue,
  Mode,
  ErrorMessage,
  UpdateType,
  UserPointAction,
  FiltersType,
  NoFilteredPointsMessage,
  ValidationMessage,
  ResponseErrorMessage,
  State,
  RenderErrorMessage
};
