import AbstractObservable from '../utils/abstract-observable';

export default class OffersModel extends AbstractObservable {
  #offers = null;
  #api = null;
  #types = new Set();

  constructor(api) {
    super();
    this.#api = api;
  }

  init = async () => {
    const offers = await this.#api.getOffers();
    this.#offers = offers;
  }

  get offers() {
    return this.#offers;
  }

  get types() {
    for (const offer of this.#offers) {
      this.#types.add(offer.type);
    }

    this.#types = Array.from(this.#types);
    return this.#types;
  }
}
