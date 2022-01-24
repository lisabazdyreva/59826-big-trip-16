import AbstractObservable from '../utils/abstract-observable';
import {UpdateType} from '../consts';


export default class DestinationsModel extends AbstractObservable {
  #api = null;

  #destinations = null;
  #names = new Set();

  constructor(api) {
    super();
    this.#api = api;
  }

  init = async () => {
    this.#destinations = await this.#api.getDestinations();

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
