import AbstractObservable from '../utils/abstract-observable';

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
  }

  get destinations() {
    return this.#destinations;
  }

  get names() {
    for (const destination of this.#destinations) {
      this.#names.add(destination.name);
    }

    return Array.from(this.#names);
  }

}
