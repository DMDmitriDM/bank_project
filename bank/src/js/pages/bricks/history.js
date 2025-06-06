import { el, mount } from 'redom';
import { getStrPointDate, getStrAfterPoint } from '../../utils/utils.js';
import pageList from '../../libr/page-list.js';

export default function historyBlock(account, arrTransactions, step = 0) {
  const historyWrapper = el('div.history-account__wrapper');

  const historyHeader = el('div.history-account__header');
  mount(historyWrapper, historyHeader);

  const historyTitle = el('h3.history-account__title', 'История переводов');
  mount(historyHeader, historyTitle);

  const historyPageBtn = el('div.history-account__page-btn');
  mount(historyHeader, historyPageBtn);

  const historyPageIncut = el('div.history-account__page-incut');
  mount(historyHeader, historyPageIncut);

  // ---

  const historyHeaderTable = el('div.history-account__header-table');
  mount(historyWrapper, historyHeaderTable);

  const historyTableFrom = el('span.history-account__header-table-title', {
    textContent: 'Счёт отправителя',
  });
  const historyTableTo = el('span.history-account__header-table-title', {
    textContent: 'Счёт получателя',
  });
  const historyTableSum = el('span.history-account__header-table-title', {
    textContent: 'Сумма',
  });
  const historyTableDate = el('span.history-account__header-table-title', {
    textContent: 'Дата',
  });

  mount(historyHeaderTable, historyTableFrom);
  mount(historyHeaderTable, historyTableTo);
  mount(historyHeaderTable, historyTableSum);
  mount(historyHeaderTable, historyTableDate);

  const historyTable = el('div.history-account__table');
  mount(historyWrapper, historyTable);

  // ---

  if (step > 0) {
    pageList(historyPageBtn, arrTransactions.length, step, stepRender);
  } else {
    renderHistoryTable(historyTable, account, arrTransactions);
  }

  function stepRender(indexStart, indexEnd) {
    // ---
    // console.log(indexStart);
    // console.log(indexEnd);

    const renderArrTransactions = arrTransactions.slice(
      indexStart,
      indexEnd + 1,
    );

    renderHistoryTable(historyTable, account, renderArrTransactions);
  }

  return historyWrapper;
}

// ---------------------------------------------------------------- //

function renderHistoryTable(historyTable, account, arrTransactions) {
  historyTable.innerHTML = '';

  const historyList = el('ul.history-account__list.list-reset');
  mount(historyTable, historyList);

  for (const transaction of arrTransactions) {
    const historyItem = el('li.history-account__item');
    mount(historyList, historyItem);

    const historyItemFrom = el('span.history-account__item-volume', {
      textContent: transaction.from,
    });
    const historyItemTo = el('span.history-account__item-volume', {
      textContent: transaction.to,
    });

    let strAmount;
    let classColor;

    if (account === transaction.from) {
      strAmount = '- ' + getStrAfterPoint(String(transaction.amount)) + ' ₽';
      classColor = '.color-red';
    } else {
      strAmount = '+ ' + getStrAfterPoint(String(transaction.amount)) + ' ₽';
      classColor = '.color-green';
    }

    const historyItemSum = el(
      `span.history-account__item-volume${classColor}`,
      {
        textContent: strAmount,
      },
    );

    const dateObj = new Date(Date.parse(transaction.date));
    const date = getStrPointDate(dateObj);

    const historyItemDate = el('span.history-account__item-volume', {
      textContent: date,
    });

    mount(historyItem, historyItemFrom);
    mount(historyItem, historyItemTo);
    mount(historyItem, historyItemSum);
    mount(historyItem, historyItemDate);
  }
}
