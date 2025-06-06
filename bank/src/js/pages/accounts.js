import { el, mount } from 'redom';
import { router } from '../index.js';

import { getAccounts, createAccount } from '../utils/api.js';
import { getStrDate } from '../utils/utils.js';
import { sortAccounts } from '../utils/sort.js';
import { creatDropDown, setDropDown } from '../libr/dropdown-check.js';

import { startSpinner, closeSpinner } from '../modal/load.js';
import { getAndTestToken, testResult } from './test/test.js';
import App from './app.js';
import renderHeader from './bricks/header.js';

// ---------------------------------------- //

export default async function renderAccounts() {
  startSpinner();

  const token = getAndTestToken();
  if (token === null) {
    closeSpinner();
    return;
  }

  const result = await getAccounts(token);
  if (!testResult(result)) {
    closeSpinner();
    return;
  }

  let arrAcconts = result.payload;

  // ---
  // console.log(arrAcconts);

  let sort = 0;
  const localSort = localStorage.getItem('sort');
  if (localSort === null) {
    localStorage.setItem('sort', '0');
  } else {
    sort = Number(localSort);
  }

  // ---------------------------------------- //
  // ------------ Создание страницы --------- //
  // ---------------------------------------- //

  const app = App.appCaseCreate();

  // ---------------------------------------- //

  renderHeader(app);

  const btnAccounts = document.getElementById('id-nav-accounts');
  btnAccounts.setAttribute('disabled', '');

  // ---------------------------------------- //

  const main = el('main.main.main--set.container');
  mount(app, main);

  const caption = el('section.caption-accounts.caption-accounts--set');
  const captionLeft = el('div.caption-accounts__left');
  const captionTitle = el('h1.caption-accounts__title', 'Ваши счета');
  const captionSort = el('div.caption-accounts__sort');
  const captionRight = el('div.caption-accounts__right');
  const captionBtn = el('button.caption-accounts__btn.blue-btn.btn-reset', {
    id: 'id-caption-accounts-btn',
    type: 'button',
  });
  const captionBtnSpan = el('span.caption-accounts__btn-span', {
    textContent: 'Создать новый счёт',
  });

  mount(captionLeft, captionTitle);
  mount(captionLeft, captionSort);
  mount(captionBtn, captionBtnSpan);
  mount(captionRight, captionBtn);
  mount(caption, captionLeft);
  mount(caption, captionRight);
  mount(main, caption);

  creatDropDown(
    captionSort,
    1,
    'Сортировка',
    ['По номеру', 'По балансу', 'По последней транзакции'],
    (i) => {
      if (i === sort) {
        return;
      }

      startSpinner();
      sort = i;
      localStorage.setItem('sort', String(sort));
      arrAcconts = sortAccounts(arrAcconts, sort);
      renderBoxAccounts(boxAccounts, arrAcconts);
      closeSpinner();
    },
  );

  setDropDown(1, sort);

  // ---------------------------------------- //

  // Создать новый счёт
  captionBtn.addEventListener('click', async () => {
    // console.log('newAccount');
    // ---
    startSpinner();

    const token = getAndTestToken();
    if (token === null) {
      closeSpinner();
      return;
    }

    let result = await createAccount(token);
    if (!testResult(result)) {
      closeSpinner();
      return;
    }

    result = await getAccounts(token);
    if (!testResult(result)) {
      closeSpinner();
      return;
    }

    arrAcconts = result.payload;

    arrAcconts = sortAccounts(arrAcconts, sort);
    renderBoxAccounts(boxAccounts, arrAcconts);
    closeSpinner();
  });

  // ---------------------------------------- //

  const boxAccounts = el('section.box-accounts.box-accounts--set');
  mount(main, boxAccounts);

  arrAcconts = sortAccounts(arrAcconts, sort);
  renderBoxAccounts(boxAccounts, arrAcconts);

  // ---------------------------------------- //

  closeSpinner();
}

// ---------------------------------------- //
// ---------------------------------------- //
// ---------------------------------------- //

function renderBoxAccounts(boxAccounts, arrAcconts) {
  boxAccounts.innerHTML = '';

  for (const account of arrAcconts) {
    const cardAccount = el('div.account-card.account-card--set');
    mount(boxAccounts, cardAccount);

    const titleAccount = el('h3.account-card-title', {
      textContent: account.account,
    });
    mount(cardAccount, titleAccount);

    const balanceAccount = el('span.account-card-balance', {
      textContent: account.balance.toFixed(2) + ' ₽',
    });
    mount(cardAccount, balanceAccount);

    const wrapperAccount = el('div.account-card-wrapper');
    mount(cardAccount, wrapperAccount);

    const transactionAccount = el('div.account-card-transaction');
    mount(wrapperAccount, transactionAccount);

    const transactionTitle = el('h4.account-card-transaction-title', {
      textContent: 'Последняя транзакция:',
    });
    mount(transactionAccount, transactionTitle);

    let date;
    if (account.transactions.length !== 0) {
      const dateObj = new Date(Date.parse(account.transactions[0].date));
      date = getStrDate(dateObj);
    } else {
      date = 'Нет транзакций';
    }

    const transactionDate = el('span.account-card-transaction-date', {
      textContent: date,
    });
    mount(transactionAccount, transactionDate);

    const btnAccount = el('button.account-card-btn.blue-btn.btn-reset', {
      type: 'button',
      textContent: 'Открыть',
    });
    mount(wrapperAccount, btnAccount);

    // Открыть подробную информацию о счёте пользователя
    btnAccount.addEventListener('click', () => {
      // console.log(account.account);
      // ---

      router.navigate(`/account/${account.account}`);
      return;
    });
  }
}
