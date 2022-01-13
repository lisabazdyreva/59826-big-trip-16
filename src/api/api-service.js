const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

const Url = {
  GET_POINTS: 'points',
  GET_DESTINATIONS: 'destinations',
  GET_OFFERS: 'offers',
};

export default class ApiService {
  #endPoint = null;
  #authorizationKey = null;

  constructor(endPoint, authorizationKey) {
    this.#endPoint = endPoint;
    this.#authorizationKey = authorizationKey;
  }

  #load = async ({url, method, body = null, headers = new Headers()}) => {
    headers.set('Authorization', this.#authorizationKey);

    const response = await fetch(`${this.#endPoint}/${url}`, {method, body, headers});

    if (response.ok) {
      return response;
    } else {
      throw new Error('OSHIB OCHKA');
    }
  }

  #adaptToServer = (point) => {
    const adaptedPoint = {
      ...point,
      'base_price': point.price,
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.price;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }

  getPoints = async () => {
    const response = await this.#load({url: Url.GET_POINTS, method: Method.GET});

    const parsedData = await response.json();
    return parsedData;
  }

  getDestinations = async () => {
    const response = await this.#load({url: Url.GET_DESTINATIONS, method: Method.GET});

    const parsedData = await response.json();
    return parsedData;
  }

  getOffers = async () => {
    const response = await this.#load({url: Url.GET_OFFERS, method: Method.GET});

    const parsedData = await response.json();
    return parsedData;
  }
}
