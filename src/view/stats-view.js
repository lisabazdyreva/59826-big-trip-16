import SmartView from './smart-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {getFormattedDuration} from '../utils/utils';


const Color = {
  BLACK: '#000000',
  WHITE: '#ffffff',
};


const createStatsView = () => (`<section class="statistics">
  <h2 class="visually-hidden">Trip statistics</h2>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="money" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="type" width="900"></canvas>
  </div>

  <div class="statistics__item">
    <canvas class="statistics__chart" id="time" width="900"></canvas>
  </div>
</section>`);


const renderMoneyChart = (context, data) => {
  const labels = Array.from(data.keys()).map((type) => type.toUpperCase());
  const prices = Array.from(data.values());

  return new Chart(context, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: prices,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: Color.BLACK,
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: Color.BLACK,
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const renderTypeChart = (context, data) => {
  const types = Array.from(data.keys()).map((type) => type.toUpperCase());
  const typesValue = Array.from(data.values());

  return new Chart(context, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: typesValue,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: Color.BLACK,
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: Color.BLACK,
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


const renderTimeChart = (context, data) => {
  const types = Array.from(data.keys()).map((type) => type.toUpperCase());
  const durations = Array.from(data.values());

  return new Chart(context, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
      datasets: [{
        data: durations,
        backgroundColor: Color.WHITE,
        hoverBackgroundColor: Color.WHITE,
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: Color.BLACK,
          anchor: 'end',
          align: 'start',
          formatter: (duration) => getFormattedDuration(duration), // TODO чекнуть на правдивость подсчета,
        },
      },
      title: {
        display: true,
        text: 'TIME',
        fontColor: Color.BLACK,
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Color.BLACK,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};


export default class StatsView extends SmartView {
  #points = null;

  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  #types = null;
  #prices = null;
  #durations = null;

  constructor(points) {
    super();

    this.#points = points;

    this.#prices = new Map();
    this.#types = new Map();
    this.#durations = new Map();


    this.#points.forEach(({price, type}) => {
      if (this.#prices.has(type)) {
        this.#prices.set(type, this.#prices.get(type) + price);
      } else {
        this.#prices.set(type, price);
      }
    });


    const sortedPrices = Array.from(this.#prices.entries()).sort(([a, b], [c, d]) => {
      return d - b;
    });
    this.#prices = new Map(sortedPrices);


    this.#points.forEach(({type}) => {
      if (this.#types.has(type)) {
        this.#types.set(type, this.#types.get(type) + 1);
      } else {
        this.#types.set(type, 1);
      }
    });

    const sortedTypes = Array.from(this.#types.entries()).sort(([a, b], [c, d]) => {
      return d - b;
    });
    this.#types = new Map(sortedTypes);


    this.#points.forEach(({type, dateFrom, dateTo}) => {
      const diffMinutes = dayjs(dateTo).diff(dateFrom, 'minute');

      if (this.#durations.has(type)) {
        this.#durations.set(type, this.#durations.get(type) + diffMinutes);
      } else {
        this.#durations.set(type, diffMinutes);
      }
    });

    const sortedDurations = Array.from(this.#durations.entries()).sort(([a, b], [c, d]) => {
      return d - b;
    });

    this.#durations = new Map(sortedDurations);

    this.#setCharts();
  }

  get template() {
    return createStatsView();
  }

  #setCharts = () => {
    const moneyContext = this.element.querySelector('#money');
    const typeContext = this.element.querySelector('#type');
    const timeContext = this.element.querySelector('#time');

    this.#moneyChart = renderMoneyChart(moneyContext, this.#prices);
    this.#typeChart = renderTypeChart(typeContext, this.#types);
    this.#timeChart = renderTimeChart(timeContext, this.#durations);
  }
}
