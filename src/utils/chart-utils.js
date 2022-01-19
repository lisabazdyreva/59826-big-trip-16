import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getFormattedDuration} from './utils';
import {ChartName} from '../consts';
import dayjs from 'dayjs';

const BAR_HEIGHT = 55;

const HexColor = {
  BLACK: '#000000',
  WHITE: '#ffffff',
};

const ChartFormatter = {
  [ChartName.MONEY]: (price) => `€ ${price}`,
  [ChartName.TYPE]: (value) => `${value}x`,
  [ChartName.TIME]: (duration) => getFormattedDuration(duration),
};


const getChart = (context, types, data, title, formatData) => new Chart(context, {
  plugins: [ChartDataLabels],
  type: 'horizontalBar',
  data: {
    labels: types,
    datasets: [{
      data: data,
      backgroundColor: HexColor.WHITE,
      hoverBackgroundColor: HexColor.WHITE,
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
        color: HexColor.BLACK,
        anchor: 'end',
        align: 'start',
        formatter: formatData,
      },
    },
    title: {
      display: true,
      text: title,
      fontColor: HexColor.BLACK,
      fontSize: 23,
      position: 'left',
    },
    scales: {
      yAxes: [{
        ticks: {
          fontColor: HexColor.BLACK,
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

const getSortedData = (data) => Array.from(data.entries()).sort((a, b) => b[1] - a[1]);

const getTypes = (data) => Array.from(data.keys()).map((type) => type.toUpperCase());

const getValues = (data) => Array.from(data.values());

const getPricesByTypes = (data, result) => {
  data.forEach(({price, type}) => {
    if (result.has(type)) {
      result.set(type, result.get(type) + price);
    } else {
      result.set(type, price);
    }
  });
  return result;
};

const getValuesByTypes = (data, result) => {
  const step = 1;

  data.forEach(({type}) => {
    if (result.has(type)) {
      result.set(type, result.get(type) + step);
    } else {
      result.set(type, 1);
    }
  });
  return result;
};

const getDurationsByTypes = (data, result) => {
  data.forEach(({type, dateFrom, dateTo}) => {
    const diffMinutes = dayjs(dateTo).diff(dateFrom, 'minute');

    if (result.has(type)) {
      result.set(type, result.get(type) + diffMinutes);
    } else {
      result.set(type, diffMinutes);
    }
  });
  return result;
};


const getData = (type, data) => {
  const result = new Map();
  let unsortedData;

  switch (type) {
    case (ChartName.MONEY):
      unsortedData = getPricesByTypes(data, result);
      break;
    case (ChartName.TYPE):
      unsortedData = getValuesByTypes(data, result);
      break;
    case (ChartName.TIME):
      unsortedData = getDurationsByTypes(data, result);
      break;
  }
  return new Map(getSortedData(unsortedData));
};

const renderChart = (context, points, chartType) => {
  const data = getData(chartType, points);

  const types = getTypes(data);
  const values = getValues(data);

  const formatData = ChartFormatter[chartType];

  context.height = BAR_HEIGHT * data.size;

  return getChart(context, types, values, chartType, formatData);
};

export {renderChart};
