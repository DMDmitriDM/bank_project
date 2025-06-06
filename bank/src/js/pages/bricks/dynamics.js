import { el, mount } from 'redom';
import Chart from 'chart.js/auto';

import { getMonthPart } from '../../utils/utils.js';

export default function dynamicsBlock(arrData) {
  const dynamicsBlock = el('div.dynamics.dynamics--set');

  const dynamicsTitle = el('h3.dynamics__title', {
    textContent: 'Динамика баланса',
  });
  mount(dynamicsBlock, dynamicsTitle);

  const dynamicsWrapper = el('div.dynamics__wrapper');
  mount(dynamicsBlock, dynamicsWrapper);

  const dynamicsDraw = el('div.dynamics__draw');
  const dynamicsScale = el('div.dynamics__scale');
  mount(dynamicsWrapper, dynamicsDraw);
  mount(dynamicsWrapper, dynamicsScale);

  let maxBalance = 0;

  for (const data of arrData) {
    if (data.maxBalance * 100 > maxBalance * 100) {
      maxBalance = data.maxBalance;
    }
  }

  const dynamicsMinBalance = el('span.dynamics__scale-span', {
    textContent: String(Math.floor(maxBalance)) + ' ₽',
  });
  const dynamicsMaxBalance = el('span.dynamics__scale-span', {
    textContent: '0 ₽',
  });

  mount(dynamicsScale, dynamicsMinBalance);
  mount(dynamicsScale, dynamicsMaxBalance);

  // ---

  const dynamicsCanvas = el('canvas.dynamics__canvas', {
    id: 'id-dynamics-canvas',
  });
  mount(dynamicsDraw, dynamicsCanvas);

  canvasOne(dynamicsCanvas, arrData);

  // ---

  return dynamicsBlock;
}

function canvasOne(ctx, arrData) {
  let maxBalance = 0;
  const arrLabels = [];
  const arrDataCanvas = [];

  for (const data of arrData) {
    arrLabels.unshift(getMonthPart(data.month));
    arrDataCanvas.unshift(Math.floor(data.maxBalance));

    if (data.maxBalance * 100 > maxBalance * 100) {
      maxBalance = data.maxBalance;
    }
  }

  const chartData = {
    labels: arrLabels,
    datasets: [
      {
        label: '# Balance',
        data: arrDataCanvas,
        borderWidth: 0,
        backgroundColor: '#116acc',
        // barThickness: 50,
        barPercentage: 0.8,
      },
    ],
  };

  const chartOptions = {
    // responsive: false,
    // maintainAspectRatio: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: '#000',
          padding: -0.5,
          font: {
            family: "'Ubuntu', arial, sans-serif",
            style: 'normal',
            weight: 700,
            size: 20,
            lineHeight: -0.02,
          },
          // align: 'end',
          // labelOffset: 18,
          labelOffset: -3,
        },
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        display: false,
        max: Math.floor(maxBalance),
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    layout: {
      padding: {
        left: 20,
        right: 20,
      },
    },
    animation: false,
    hover: {
      mode: null,
    },
  };

  new Chart(ctx, {
    type: 'bar',
    data: chartData,
    options: chartOptions,
  });
}
