import { el, mount } from 'redom';
import { router } from '../index.js';

import { getAccount } from '../utils/api.js';
import { getHistoryBalance } from '../utils/utils.js';
import { startSpinner, closeSpinner } from '../modal/load.js';
import { getAndTestToken, testResult } from './test/test.js';
import App from './app.js';
import renderHeader from './bricks/header.js';
import dynamicsBlock from './bricks/dynamics.js';
import transactionsBlock from './bricks/transactions.js';
import historyBlock from './bricks/history.js';

export default async function renderAccountTwo(id) {
  startSpinner();

  const token = getAndTestToken();
  if (token === null) {
    closeSpinner();
    return;
  }

  // Данные для вывода

  const result = await getAccount(id, token);
  if (!testResult(result)) {
    closeSpinner();
    return;
  }

  const account = result.payload;

  const historyBalance = getHistoryBalance(
    account.account,
    account.balance,
    12,
    account.transactions,
  );

  // ---
  // console.log(id);
  // console.log(account);
  // console.log(historyBalance);

  // ---------------------------------------- //
  // ------------ Создание страницы --------- //
  // ---------------------------------------- //

  const app = App.appCaseCreate();

  // ---------------------------------------- //

  renderHeader(app);

  // ---------------------------------------- //

  const main = el('main.main-account.main-account--set.container');
  mount(app, main);

  const caption = el('section.caption-account.caption-account--set');
  const captionTop = el('div.caption-account__top');
  const captionTitle = el('h1.caption-account__title', 'История баланса');
  const captionBtn = el('button.caption-account__btn.blue-btn.btn-reset', {
    id: 'id-caption-account-btn',
    type: 'button',
  });
  const captionBtnSpan = el('span.caption-account__btn-span', {
    textContent: 'Вернуться назад',
  });

  captionBtn.addEventListener('click', () => {
    router.navigate(`/account/${account.account}`);
    return;
  });

  const captionBottom = el('div.caption-account__bottom');
  const captionNumber = el('span.caption-account__number', {
    textContent: `№ ${account.account}`,
  });

  const captionWrapper = el('div.caption-account__wrapper');
  const captionBalanceTitle = el('span.caption-account__balance-title', {
    textContent: 'Баланс',
  });

  const captionBalanceValue = el('span.caption-account__balance-value', {
    textContent: `${account.balance.toFixed(2)} ₽`,
  });

  mount(captionTop, captionTitle);
  mount(captionTop, captionBtn);
  mount(captionBtn, captionBtnSpan);

  mount(captionBottom, captionNumber);
  mount(captionBottom, captionWrapper);
  mount(captionWrapper, captionBalanceTitle);
  mount(captionWrapper, captionBalanceValue);

  mount(caption, captionTop);
  mount(caption, captionBottom);
  mount(main, caption);

  // ---------------------------------------- //

  const dynamicsSection = el('section.dynamics-section.dynamics-section--set');
  mount(main, dynamicsSection);

  const dynamicsBox = dynamicsBlock(historyBalance);
  mount(dynamicsSection, dynamicsBox);

  // ---------------------------------------- //

  const transactionsSection = el(
    'section.transactions-section.transactions-section--set',
  );
  mount(main, transactionsSection);

  const transactionsBox = transactionsBlock(historyBalance);
  mount(transactionsSection, transactionsBox);

  // ---------------------------------------- //

  const historySection = el('section.history-account.history-account--set');
  mount(main, historySection);

  const renderArrTransactions = account.transactions.slice();
  renderArrTransactions.reverse();

  let historyBox;
  if (renderArrTransactions.length > 25) {
    historyBox = historyBlock(account.account, renderArrTransactions, 25);
  } else {
    historyBox = historyBlock(account.account, renderArrTransactions);
  }

  mount(historySection, historyBox);

  closeSpinner();
}
