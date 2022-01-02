import AbstractObservable from '../utils/abstract-observable';

export default class PointsModel extends AbstractObservable {
  #points = [];

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points.slice();
  }

  updatePoint(updatingItem) {
    const index = this.#points.findIndex((item) => item.id === updatingItem.id);

    if (index === -1) {
      return this.#points;
    }

    return [
      ...this.#points.slice(0, index),
      updatingItem,
      ...this.#points.slice(index + 1),
    ];

  }
}
