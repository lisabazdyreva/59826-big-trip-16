import dayjs from 'dayjs';
import {TimeFormat} from '../consts';

const getCitiesTemplate = (cities) => {
  const startCity = cities[0];
  const finishCity = cities[cities.length - 1];

  return `<h1 class="trip-info__title">${startCity} &mdash; ${(cities.length > 3) ? '...' : cities[1]} &mdash; ${finishCity}`;
};


const getDatesTemplate = (startPoint, finishPoint) => {

  const fromDate = dayjs(startPoint.dateFrom);
  const toDate = dayjs(finishPoint.dateTo);

  const startMonth = fromDate.month();
  const finishMonth = toDate.month();

  const startDate = fromDate.format(TimeFormat.MONTH_DAY);

  const formatFinishDate = (startMonth === finishMonth) ? TimeFormat.DAY : TimeFormat.MONTH_DAY;
  const finishDate = toDate.format(formatFinishDate);

  return `<p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p>`;
};


const getCost = (points) => points.slice().reduce((total, point) => {
  const {offers, price} = point;

  let offersCost = 0;

  for (const offer of offers) {
    offersCost += offer.price;
  }

  return total + price + offersCost;
}, 0); // TODO посмотреть в ТЗ, не грузит насчет стоимости предложений


const createInfoView = (points) => {
  const sortedPoints = points.sort((a, b) => dayjs(a.dateFrom) - dayjs(b.dateFrom)); // TODO пока так
  const cities = Array.from(new Set(sortedPoints.map(({destination}) => destination.name)));

  const startPoint = sortedPoints[0];
  const finishPoint = sortedPoints[points.length-1];

  const citiesTemplate = getCitiesTemplate(cities);
  const datesTemplate = getDatesTemplate(startPoint, finishPoint);
  const cost = getCost(points);

  return`<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${citiesTemplate}
      ${datesTemplate}
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
    </p>
  </section>`;
};

export {createInfoView};
