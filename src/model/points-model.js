import AbstractObservable from '../utils/abstract-observable';

export default class PointsModel extends AbstractObservable {
  #points = [];

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points.slice();
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
