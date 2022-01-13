const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

const Url = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
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

    return ApiService.checkStatusResponse(response);
  }

  static checkStatusResponse = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
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
    const response = await this.#load({url: Url.POINTS, method: Method.GET});

    const parsedData = await response.json();
    return parsedData;
  }

  getDestinations = async () => {
    const response = await this.#load({url: Url.DESTINATIONS, method: Method.GET});

    const parsedData = await response.json();
    return parsedData;
  }

  getOffers = async () => {
    const response = await this.#load({url: Url.OFFERS, method: Method.GET});

    const parsedData = await response.json();
    return parsedData;
  }

  updatePoint = async (point) => {
    const response = await this.#load({
      url: `${Url.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type' : 'application/json'}),
    });

    const parsedData = await response.json();
    return parsedData;
  }

  addPoint = async (point) => {
    const response = await this.#load({
      url: Url.POINTS,
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type' : 'application/json'}),
    });

    const parsedData = await response.json();
    return parsedData;
  }

  removePoint = async (point) => {
    const response = await this.#load({
      url: `${Url.POINTS}/${point.id}`,
      method: Method.DELETE,
    });

    return response;
  }
}
