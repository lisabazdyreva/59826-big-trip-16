import AbstractObservable from '../utils/abstract-observable';

export default class OffersModel extends AbstractObservable {
  #offers = [];

  get offers() {
    return this.#offers;
  }

  set offers(offers) {
    this.#offers = offers.slice();
  }
}
