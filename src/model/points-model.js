import AbstractObservable from '../utils/abstract-observable';

export default class PointsModel extends AbstractObservable {
  #points = [];

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = points.slice();
  }

  updatePoint() {

  }
}
