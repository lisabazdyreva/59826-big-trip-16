import SmartView from './smart-view';
import {ChartName} from '../consts';
import {renderChart} from '../utils/chart-utils';


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


export default class StatsView extends SmartView {
  #points = null;

  #moneyChart = null;
  #typeChart = null;
  #timeChart = null;

  #moneyContext = null;
  #typeContext = null;
  #timeContext = null;

  constructor(points) {
    super();

    this.#points = points;

    this.#moneyContext = this.element.querySelector('#money');
    this.#typeContext = this.element.querySelector('#type');
    this.#timeContext = this.element.querySelector('#time');

    this.#setCharts();
  }

  get template() {
    return createStatsView();
  }

  #setCharts = () => {
    this.#moneyChart = renderChart(this.#moneyContext, this.#points, ChartName.MONEY);
    this.#typeChart = renderChart(this.#typeContext, this.#points, ChartName.TYPE);
    this.#timeChart = renderChart(this.#timeContext, this.#points, ChartName.TIME);
  }
}
