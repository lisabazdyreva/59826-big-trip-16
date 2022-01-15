import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../consts';

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

    for (const offer of this.#offers) {
      this.#types.add(offer.type);
    }

    this._notify(UpdateType.OFFERS_DOWNLOADED);

  }

  get offers() {
    return this.#offers;
  }

  get types() {
    return Array.from(this.#types);
  }
}
