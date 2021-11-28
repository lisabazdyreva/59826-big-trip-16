import dayjs from 'dayjs';
import {TimeFormat} from '../consts';


const createInfoView = (points) => {
  const startPoint = points[0];
  const finishPoint = points[points.length-1];

  const startCity = startPoint.destination.name;
  const finishCity = finishPoint.destination.name;

  const startDate = dayjs(startPoint.dateFrom).format(TimeFormat.MONTH_DAY);
  const finishDate = dayjs(finishPoint.dateTo).format(TimeFormat.MONTH_DAY);

  return`<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${startCity} &mdash; ... &mdash; ${finishCity}</h1> <!--TODO город посередине, если 3 в поездке-->

      <p class="trip-info__dates">${startDate}&nbsp;&mdash;&nbsp;${finishDate}</p> <!--TODO месяц 1 показывать, если все в одном месяце-->
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
    </p>
  </section>`;
};

export {createInfoView};
