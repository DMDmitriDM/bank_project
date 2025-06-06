import { el, mount } from 'redom';
import Chart from 'chart.js/auto';

import { getMonthPart } from '../../utils/utils.js';

export default function transactionsBlock(arrData) {
  const dynamicsBlock = el('div.dynamics.dynamics--set');

  const dynamicsTitle = el('h3.dynamics__title', {
    textContent: 'Соотношение входящих исходящих транзакций',
  });
  mount(dynamicsBlock, dynamicsTitle);

  const dynamicsWrapper = el('div.dynamics__wrapper');
  mount(dynamicsBlock, dynamicsWrapper);

  const dynamicsDraw = el('div.dynamics__draw');
  const dynamicsScale = el('div.dynamics__scale');
  mount(dynamicsWrapper, dynamicsDraw);
  mount(dynamicsWrapper, dynamicsScale);

  let maxTransactions = 0;
  let maxDebit = 0;
  let maxCredit = 0;

  for (const data of arrData) {
    if ((data.debit + data.credit) * 100 > maxTransactions * 100) {
      maxTransactions = data.debit + data.credit;
    }

    if (data.debit * 100 > maxDebit * 100) {
      maxDebit = data.debit;
    }

    if (data.credit * 100 > maxCredit * 100) {
      maxCredit = data.credit;
    }
  }

  const dynamicsMax = el('span.dynamics__scale-span', {
    textContent: String(Math.floor(maxTransactions)) + ' ₽',
  });

  // const dynamicsMiddle = el('span.dynamics__scale-span', {
  //   textContent:
  //     String(Math.min(Math.floor(maxDebit), Math.floor(maxCredit))) + ' ₽',
  // });

  const dynamicsMiddle = el('div.dynamics__scale-midle');
  const dynamicsMiddleCredit = el('span.dynamics__scale-span.color-red', {
    textContent: String(Math.floor(maxCredit)) + ' ₽',
  });
  const dynamicsMiddleDebit = el('span.dynamics__scale-span.color-green', {
    textContent: String(Math.floor(maxDebit)) + ' ₽',
  });

  const dynamicsMin = el('span.dynamics__scale-span', {
    textContent: '0 ₽',
  });

  mount(dynamicsMiddle, dynamicsMiddleDebit);
  mount(dynamicsMiddle, dynamicsMiddleCredit);
  mount(dynamicsScale, dynamicsMax);
  mount(dynamicsScale, dynamicsMiddle);
  mount(dynamicsScale, dynamicsMin);

  // ---

  const dynamicsCanvas = el('canvas.dynamics__canvas', {
    id: 'id-transactions-canvas',
  });
  mount(dynamicsDraw, dynamicsCanvas);

  canvasTwo(dynamicsCanvas, arrData);

  // ---

  return dynamicsBlock;
}

function canvasTwo(ctx, arrData) {
  const arrLabels = [];
  const arrDataDebit = [];
  const arrDataCredit = [];

  // ------------------------------------------------ //
  // Выводим числовые значения debit и credit

  // let maxTransactions = 0;
  // for (const data of arrData) {
  //   arrLabels.unshift(getMonthPart(data.month));
  //   arrDataCredit.unshift(Math.floor(data.credit));
  //   arrDataDebit.unshift(Math.floor(data.debit));

  //   if ((data.debit + data.credit) * 100 > maxTransactions * 100) {
  //     maxTransactions = data.debit + data.credit;
  //   }
  // }

  // ------------------------------------------------ //
  // Выводим по месяцам в процентах (каждый месяц 100%)

  // let percentDebit;
  // let percentCredit;

  // for (const data of arrData) {
  //   arrLabels.unshift(getMonthPart(data.month));

  //   if (data.debit * 100 + data.credit * 100 === 0) {
  //     percentDebit = 0;
  //     percentCredit = 0;

  //     arrDataDebit.unshift(percentDebit);
  //     arrDataCredit.unshift(percentCredit);

  //     continue;
  //   }

  //   if (data.debit * 100 >= data.credit * 100) {
  //     percentDebit = Math.floor(
  //       (data.debit * 100) / (data.debit + data.credit),
  //     );
  //     percentCredit = 100 - percentDebit;
  //   } else {
  //     percentCredit = Math.floor(
  //       (data.debit * 100) / (data.debit + data.credit),
  //     );
  //     percentDebit = 100 - percentCredit;
  //   }

  //   arrDataDebit.unshift(percentDebit);
  //   arrDataCredit.unshift(percentCredit);
  // }

  // ------------------------------------------------ //
  // Выводим по месяцам в процентах
  // (каждый месяц в процентах от maxTransactions)
  let maxTransactions = 0;
  const arrTransactions = [];
  const arrRatio = [];

  // Вычисляем коэффициент
  for (const data of arrData) {
    if ((data.debit + data.credit) * 100 > maxTransactions * 100) {
      maxTransactions = data.debit + data.credit;
    }

    arrTransactions.push(data.debit + data.credit);
  }

  for (const data of arrTransactions) {
    let ratio = 0;

    if (maxTransactions * 100 !== 0) {
      ratio = (Math.floor(data) * 100) / Math.floor(maxTransactions);
      ratio = ratio / 100;
    }

    arrRatio.unshift(ratio);
  }

  // Вычисляем по месяцам в процентах (каждый месяц 100%)
  let percentDebit;
  let percentCredit;

  for (const data of arrData) {
    arrLabels.unshift(getMonthPart(data.month));

    if (data.debit * 100 + data.credit * 100 === 0) {
      percentDebit = 0;
      percentCredit = 0;

      arrDataDebit.unshift(percentDebit);
      arrDataCredit.unshift(percentCredit);

      continue;
    }

    if (data.debit * 100 >= data.credit * 100) {
      percentDebit = Math.floor(
        (data.debit * 100) / (data.debit + data.credit),
      );
      percentCredit = 100 - percentDebit;
    } else {
      percentCredit = Math.floor(
        (data.debit * 100) / (data.debit + data.credit),
      );
      percentDebit = 100 - percentCredit;
    }

    arrDataDebit.unshift(percentDebit);
    arrDataCredit.unshift(percentCredit);
  }

  // ---
  // console.log(arrRatio);
  // console.log(arrDataDebit);
  // console.log(arrDataCredit);

  // Приводим в соответствие с коэффициентом
  for (let i = 0; i < arrRatio.length; i++) {
    arrDataDebit[i] = Math.ceil(arrDataDebit[i] * arrRatio[i]);
    arrDataCredit[i] = Math.ceil(arrDataCredit[i] * arrRatio[i]);
  }

  // ---
  // console.log(arrDataDebit);
  // console.log(arrDataCredit);

  // const ctx = document.getElementById('id-transactions-canvas');

  const chartCredit = {
    label: '# red',
    data: arrDataCredit,
    borderWidth: 0,
    backgroundColor: '#f00c0c',
    // barThickness: 50,
    barPercentage: 0.8,
  };

  const charDebit = {
    label: '# Green',
    data: arrDataDebit,
    borderWidth: 0,
    backgroundColor: '#14c714',
    // barThickness: 50,
    barPercentage: 0.8,
  };

  const chartData = {
    labels: arrLabels,
    datasets: [chartCredit, charDebit],
  };

  const chartOptions = {
    // responsive: false,
    // maintainAspectRatio: true,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
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
        stacked: true,
        max: 100,
        // max: Math.floor(maxTransactions),
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
