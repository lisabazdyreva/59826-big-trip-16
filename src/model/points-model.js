import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../consts';

export default class PointsModel extends AbstractObservable {
  #points = [];
  #api = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  init = async () => {
    const points = await this.#api.getPoints();
    this.#points = points.map(this.#adaptToClient);

    this._notify(UpdateType.INIT);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      price: point['base_price'],
      dateFrom: point['date_from'], //TODO Data - isoString
      dateTo: point['date_to'],//TODO Data - isoString
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }

  get points() {
    return this.#points;
  }

  updatePoint(updateType, updatingItem) {
    const index = this.#points.findIndex((item) => item.id === updatingItem.id);

    if (index === -1) {
      return this.#points;
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatingItem,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatingItem);
  }

  addPoint(updateType, updatingItem) {
    this.#points = [
      updatingItem,
      ...this.#points,
    ];

    this._notify(updateType, updatingItem);
  }

  removePoint(updateType, updatingItem) {
    const index = this.#points.findIndex((item) => item.id === updatingItem.id);

    if (index === -1) {
      throw new Error('Can\'t remove task.');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatingItem);
  }
}
