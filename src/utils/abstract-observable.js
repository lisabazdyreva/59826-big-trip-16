export default class AbstractObservable {
  #observers = new Set();

  add(observer) {
    this.#observers.add(observer);
  }

  remove(observer) {
    this.#observers.delete(observer);
  }

  _notify(updateType, updatingItem) {
    this.#observers.forEach((observer) => observer(updateType, updatingItem));
  }
}
