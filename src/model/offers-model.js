import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../consts';


export default class OffersModel extends AbstractObservable {
  #api = null;
  #offers = null;
  #types = new Set();

  constructor(api) {
    super();
    this.#api = api;
  }

  init = async () => {
    this.#offers = await this.#api.getOffers();

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
