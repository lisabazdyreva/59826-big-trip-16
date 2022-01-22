import AbstractObservable from '../utils/abstract-observable';
import {ResponseErrorMessage, UpdateType} from '../consts';
import dayjs from 'dayjs';


export default class PointsModel extends AbstractObservable {
  #points = [];
  #api = null;

  constructor(api) {
    super();
    this.#api = api;
  }

  init = async () => {

    try {
      const points = await this.#api.getPoints();
      this.#points = points.map(this.#adaptToClient);
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {
      ...point,
      price: point['base_price'],
      dateFrom: dayjs(point['date_from']),
      dateTo: dayjs(point['date_to']),
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

  updatePoint = async (updateType, updatingItem) => {
    const index = this.#points.findIndex((item) => item.id === updatingItem.id);

    if (index === -1) {
      return this.#points;
    }

    try {
      const response = await this.#api.updatePoint(updatingItem);
      const updatedPoint = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatingItem);
    } catch(err) {
      throw new Error(ResponseErrorMessage.UPDATE);
    }
  }

  addPoint = async (updateType, updatingItem) => {
    try {
      const response = await this.#api.addPoint(updatingItem);
      const adaptedPoint = this.#adaptToClient(response);

      this.#points = [
        adaptedPoint,
        ...this.#points,
      ];

      this._notify(updateType, updatingItem);
    } catch (err) {
      throw new Error(ResponseErrorMessage.ADD);
    }
  }

  removePoint = async (updateType, updatingItem) => {
    const index = this.#points.findIndex((item) => item.id === updatingItem.id);

    if (index === -1) {
      throw new Error(ResponseErrorMessage.REMOVE);
    }

    try {
      await this.#api.removePoint(updatingItem);

      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];

      this._notify(updateType, updatingItem);
    } catch (err) {
      throw new Error(ResponseErrorMessage.REMOVE);
    }
  }
}
