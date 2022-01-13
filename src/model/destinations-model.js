import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../consts';

export default class DestinationsModel extends AbstractObservable {
  #destinations = null;
  #api = null;
  #names = new Set();

  constructor(api) {
    super();
    this.#api = api;
  }

  init = async () => {
    const destinations = await this.#api.getDestinations();
    this.#destinations = destinations;

    for (const destination of this.#destinations) {
      this.#names.add(destination.name);
    }

    this._notify(UpdateType.DESTINATIONS_DOWNLOADED);


  }

  get destinations() {

    return this.#destinations;
  }

  get names() {
    return Array.from(this.#names);
  }

}
