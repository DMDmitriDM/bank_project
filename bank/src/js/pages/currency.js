import { el, mount, unmount } from 'redom';

import {
  getCurrwncies,
  getCurrencyAccounts,
  buyCurrency,
  getSocketCurrency,
} from '../utils/api.js';
import { validateFormSend } from '../utils/validation.js';
import { startSpinner, closeSpinner } from '../modal/load.js';
import errorModal from '../modal/error-modal.js';
import { getAndTestToken, testResult } from './test/test.js';
import App from './app.js';
import renderHeader from './bricks/header.js';
import { creatDropDown, getValueDropDown } from '../libr/dropdown.js';

export default async function renderCurrency() {
  startSpinner();

  const token = getAndTestToken();
  if (token === null) {
    closeSpinner();
    return;
  }

  // Данные для вывода

  const resultCurrwncie = await getCurrwncies(token);
  if (!testResult(resultCurrwncie)) {
    closeSpinner();
    return;
  }

  const arrNameCurrwnciesAccounts = resultCurrwncie.payload;

  const resultCurrencyAccounts = await getCurrencyAccounts(token);
  if (!testResult(resultCurrencyAccounts)) {
    closeSpinner();
    return;
  }

  const arrCurrencyAccounts = [];
  const arrNameCurrencyAccounts = [];
  const objCurrencyAccounts = resultCurrencyAccounts.payload;
  for (const currency in objCurrencyAccounts) {
    if (Number(objCurrencyAccounts[currency].amount.toFixed(2)) * 100 > 0) {
      arrCurrencyAccounts.push(objCurrencyAccounts[currency]);
      arrNameCurrencyAccounts.push(currency);
    }
  }

  // ---
  // console.log(resultCurrwncie);
  // console.log(resultCurrencyAccounts);

  // console.log(arrCurrencyAccounts);
  // console.log(arrNameCurrencyAccounts);

  // ---------------------------------------- //
  // ------------ Создание страницы --------- //
  // ---------------------------------------- //

  const app = App.appCaseCreate();

  // ---------------------------------------- //

  renderHeader(app);

  const btnCurrency = document.getElementById('id-nav-currency');
  btnCurrency.setAttribute('disabled', '');

  // ---------------------------------------- //

  const main = el('main.main-currency.main-currency--set.container');
  mount(app, main);

  const caption = el('section.caption-currency.caption-currency--set');
  const captionTitle = el('h1.caption-currency__title', 'Валютный обмен');
  mount(caption, captionTitle);
  mount(main, caption);

  // ---------------------------------------- //

  const sectionCurrency = el('section.section-currency.section-currency--set');
  mount(main, sectionCurrency);

  const leftBlock = el('div.section-currency__left');
  const rightBlock = el('div.section-currency__right');
  mount(sectionCurrency, leftBlock);
  mount(sectionCurrency, rightBlock);

  // ---------------------------------------- //

  const currencyAccounts = el('div.currency-accounts.currency-accounts--set');
  const currencyAccountsTitle = el(
    'h3.currency-accounts__title',
    'Ваши валлюты',
  );
  const currencyAccountsScroll = el('div.currency-accounts__scroll');
  const currencyAccountsList = el('ul.currency-accounts__list.list-reset');

  mount(leftBlock, currencyAccounts);
  mount(currencyAccounts, currencyAccountsTitle);
  mount(currencyAccounts, currencyAccountsScroll);
  mount(currencyAccountsScroll, currencyAccountsList);

  for (const currency of arrCurrencyAccounts) {
    const itemCurrencyAccounts = el('li.currency-accounts__item');
    const nameCurrencyAccounts = el(
      'span.currency-accounts__item-name',
      `${currency.code}`,
    );
    const incutCurrencyAccounts = el('span.currency-accounts__item-incut');
    const amountCurrencyAccounts = el(
      'span.currency-accounts__item-amount',
      currency.amount.toFixed(2),
    );

    mount(itemCurrencyAccounts, nameCurrencyAccounts);
    mount(itemCurrencyAccounts, incutCurrencyAccounts);
    mount(itemCurrencyAccounts, amountCurrencyAccounts);
    mount(currencyAccountsList, itemCurrencyAccounts);
  }

  const scrollbarWidth =
    currencyAccountsScroll.offsetWidth - currencyAccountsScroll.clientWidth;

  if (scrollbarWidth > 0) {
    currencyAccountsScroll.style.paddingRight = `${scrollbarWidth}px`;
  }

  // ---------------------------------------- //

  const formBuy = el('form.form-buy.form-buy--set', {
    id: 'id-form-buy',
    autocomplete: 'off',
    novalidate: '',
  });

  formBuy.addEventListener('submit', (e) => {
    e.preventDefault();
  });
  mount(leftBlock, formBuy);

  const formBuyTitle = el('h3.form-buy__title', 'Обмен валюты');
  mount(formBuy, formBuyTitle);

  const formBuyWrapper = el('div.form-buy__wrapper');
  mount(formBuy, formBuyWrapper);

  // ---

  const formBuyLeftBlock = el('div.form-buy__left-block');
  mount(formBuyWrapper, formBuyLeftBlock);

  const boxCurrwncies = el('div.form-buy__currwncies-box');
  mount(formBuyLeftBlock, boxCurrwncies);

  const titleCurrwnciesFrom = el('span.form-buy__currwncies-span', 'Из');
  mount(boxCurrwncies, titleCurrwnciesFrom);

  const dropCurrwnciesFrom = el('div.form-buy__currwncies-drop');
  mount(boxCurrwncies, dropCurrwnciesFrom);

  creatDropDown(
    dropCurrwnciesFrom,
    1,
    arrNameCurrencyAccounts.sort(),
    null,
    onChangeDropDown,
  );

  const titleCurrwnciesTo = el('span.form-buy__currwncies-span', 'в');
  mount(boxCurrwncies, titleCurrwnciesTo);

  const dropCurrwnciesTo = el('div.form-buy__currwncies-drop');
  mount(boxCurrwncies, dropCurrwnciesTo);

  creatDropDown(
    dropCurrwnciesTo,
    2,
    arrNameCurrwnciesAccounts.sort(),
    null,
    onChangeDropDown,
  );

  // ---

  const boxInputBuy = el('div.form-buy__box-input');
  mount(formBuyLeftBlock, boxInputBuy);

  const titleSum = el('span.form-buy__input-title', 'Сумма');
  const inputSum = el('input.form-buy__input', {
    type: 'text',
    name: 'buy',
    id: 'id-buy-input',
    ['data-error']: 'id-buy-error',
    ['data-success']: 'id-buy-success',
  });
  const errorSum = el('span.form-buy__span-error', {
    id: 'id-buy-error',
  });
  const successSum = el('span.form-buy__span-success', {
    id: 'id-buy-success',
    textContent: 'Заполнено',
  });

  inputSum.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.code === 'Enter') {
      event.preventDefault();
    }
  });

  mount(boxInputBuy, titleSum);
  mount(boxInputBuy, inputSum);
  mount(boxInputBuy, errorSum);
  mount(boxInputBuy, successSum);

  // ---

  const formBuyRightBlock = el('div.form-buy__right-block');
  mount(formBuyWrapper, formBuyRightBlock);

  const formBuyBtn = el('button.form-buy__btn.blue-btn.btn-reset', 'Обменять', {
    id: 'id-form-buy-btn',
    type: 'button',
    disabled: true,
  });
  mount(formBuyRightBlock, formBuyBtn);

  formBuyBtn.addEventListener('click', async () => {
    const token = getAndTestToken();
    if (token === null) {
      closeSpinner();
      return;
    }

    const result = await buyCurrency(
      getValueDropDown(1),
      getValueDropDown(2),
      inputSum.value,
      token,
    );

    // ---
    // console.log(result);

    if (result.error === 500 && result.catchLog !== null) {
      closeSpinner();

      errorModal('Ошибка сервера: ' + result.catchLog);
      return;
    }

    if (result.error === 'Not enough currency') {
      closeSpinner();

      errorModal('Ошибка : На валютном счёте списания нет средств');
      return;
    }

    if (result.error === 'Invalid amount') {
      closeSpinner();

      inputSum.classList.remove('form-buy__input--success');
      successSum.classList.remove('form-buy__span-success--active');

      inputSum.classList.add('form-buy__input--error');
      errorSum.classList.add('form-buy__span-error--active');
      errorSum.textContent = 'Неверная сумма!';

      formBuyBtn.setAttribute('disabled', '');
      return;
    }

    if (result.error === 'Overdraft prevented') {
      closeSpinner();

      inputSum.classList.remove('form-buy__input--success');
      successSum.classList.remove('form-buy__span-success--active');

      inputSum.classList.add('form-buy__input--error');
      errorSum.classList.add('form-buy__span-error--active');
      errorSum.textContent = 'Недастаточно средств!';

      formBuyBtn.setAttribute('disabled', '');
      return;
    }

    if (result.error !== '') {
      closeSpinner();

      errorModal('Ошибка: ' + result.error);
      return;
    }

    if (result.payload === null) {
      closeSpinner();

      errorModal('Ошибка: Невозможно получить данные!');
      return;
    }

    // Ошибок нет перезагружаем страницу
    objError.drop = false;
    objError.buy = false;
    closeSocket();
    renderCurrency();
  });

  // Работа инпутов и DropDown
  changeKeyDrop();
  inputWork();

  // ---------------------------------------- //

  const boardCurrency = el('div.board-currency.board-currency--set');
  mount(rightBlock, boardCurrency);

  const boardCurrencyTitle = el(
    'h3.board-currency__title',
    'Изменение курсов в реальном времени',
  );
  mount(boardCurrency, boardCurrencyTitle);

  // ---

  createBoardCurrencyList(boardCurrency);

  function createBoardCurrencyList(parent) {
    const boardCurrencyScroll = el('div.board-currency__scroll');
    mount(parent, boardCurrencyScroll);

    const errorMessageBox = el('div.board-error-box.board-error-box--set', {
      id: 'id-board-currency-error',
    });
    mount(boardCurrencyScroll, errorMessageBox);

    const errorMessageTitle = el(
      'h3.board-error-box__title',
      'Ошибка данных!',
      {
        id: 'id-board-currency-error-title',
      },
    );
    mount(errorMessageBox, errorMessageTitle);

    const boardCurrencyList = el('ul.board-currency__list.list-reset', {
      id: 'id-board-currency-list',
    });
    mount(boardCurrencyScroll, boardCurrencyList);
  }

  async function renderBoardCurrencyList(data) {
    const errorMessageBox = document.getElementById('id-board-currency-error');
    errorMessageBox.classList.remove('board-error-box--active');

    const boardCurrencyList = document.getElementById('id-board-currency-list');

    if (boardCurrencyList.children.length === 12) {
      unmount(boardCurrencyList, boardCurrencyList.lastElementChild);
    }

    const itemList = el('li.board-currency__item');
    mount(boardCurrencyList, itemList, boardCurrencyList.firstElementChild);

    const nameBoardCurrency = el(
      'span.board-currency__item-name',
      `${data.from}/${data.to}`,
    );

    const incutBoardCurrency = el('span.board-currency__item-incut');

    const amountBoardCurrency = el(
      'span.board-currency__item-amount',
      `${data.rate}`,
    );

    const imgBoardCurrency = el('span.board-currency__item-img');

    if (data.change === 1) {
      incutBoardCurrency.classList.add('board-currency__item-incut--green');
      imgBoardCurrency.classList.add('board-currency__item-img--green');
    } else if (data.change === -1) {
      incutBoardCurrency.classList.add('board-currency__item-incut--red');
      imgBoardCurrency.classList.add('board-currency__item-img--red');
    }

    mount(itemList, nameBoardCurrency);
    mount(itemList, incutBoardCurrency);
    mount(itemList, amountBoardCurrency);
    mount(itemList, imgBoardCurrency);
  }

  const resultSocket = await getSocketCurrency();
  const socket = resultSocket.payload;

  if (socket === null) {
    const errorMessageBox = document.getElementById('id-board-currency-error');
    errorMessageBox.classList.add('board-error-box--active');
    errorMessageBox.style.top = `${window.scrollY}px`;
    return;
  }

  socket.onmessage = async (event) => {
    try {
      const data = await JSON.parse(event.data);

      if (data.type !== 'EXCHANGE_RATE_CHANGE') {
        return;
      }

      renderBoardCurrencyList(data);
    } catch {
      return;
    }
  };

  socket.onopen = () => {
    // ---
    // console.log(socket.readyState);

    window.addEventListener('unload', closeSocket);
    window.addEventListener('popstate', closeSocket);

    const arrNavBtn = document.querySelectorAll('.nav__btn');
    for (const navBtn of arrNavBtn) {
      navBtn.addEventListener('click', closeSocket);
    }
  };

  socket.onclose = (event) => {
    if (!event.wasClean) {
      // сервер убил процесс или сеть недоступна
      // обычно в этом случае event.code 1006
      // ---
      // console.log('Соединение прервано');
      const errorMessageBox = document.getElementById(
        'id-board-currency-error',
      );
      errorMessageBox.classList.add('board-error-box--active');
      errorMessageBox.style.top = `${window.scrollY}px`;
    }
  };

  socket.onerror = (error) => {
    // ---
    // console.log(error);
    const errorMessageBox = document.getElementById('id-board-currency-error');
    errorMessageBox.classList.add('board-error-box--active');
    errorMessageBox.style.top = `${window.scrollY}px`;
    const errorMessageTitle = document.getElementById(
      'id-board-currency-error-title',
    );
    errorMessageTitle.textContent =
      errorMessageTitle.textContent + ': ' + String(error);
  };

  function closeSocket() {
    // ---
    // console.log('closeSocket');

    if (socket !== null && socket !== undefined) {
      socket.close();
    }

    window.removeEventListener('unload', closeSocket);
    window.removeEventListener('popstate', closeSocket);
  }

  // ---------------------------------------- //

  closeSpinner();
}

// ---------------------------------------- //
// ------ Работа инпутов и DropDown ------- //
// ---------------------------------------- //

const objError = {
  drop: false,
  buy: false,
};

function changeKeyDrop() {
  const fromBuyValue = getValueDropDown(1);
  const toBuyValue = getValueDropDown(2);

  if (fromBuyValue === toBuyValue) {
    objError.drop = false;
  } else {
    objError.drop = true;
  }
}

function changeFormBtn() {
  const formSendBtn = document.getElementById('id-form-buy-btn');

  for (const key in objError) {
    if (!objError[key]) {
      formSendBtn.setAttribute('disabled', '');

      return;
    }
  }

  formSendBtn.removeAttribute('disabled');
}

function onChangeDropDown() {
  changeKeyDrop();

  changeFormBtn();
}

function inputWork() {
  const arrInputs = document.querySelectorAll('.form-buy__input');
  for (const input of arrInputs) {
    input.addEventListener('blur', () => {
      const valid = validateFormSend[input.id](input.value);

      if (valid !== '') {
        input.classList.add('form-buy__input--error');

        const spanError = document.getElementById(input.dataset.error);
        spanError.classList.add('form-buy__span-error--active');
        spanError.textContent = valid;

        objError[input.name] = false;
      } else {
        objError[input.name] = true;
      }

      changeFormBtn();
    });

    input.addEventListener('input', () => {
      input.classList.remove('form-buy__input--error');

      const spanError = document.getElementById(input.dataset.error);
      spanError.textContent = '';
      spanError.classList.remove('form-buy__span-error--active');

      const spanSuccess = document.getElementById(input.dataset.success);

      const valid = validateFormSend[input.id](input.value);

      if (valid !== '') {
        input.classList.remove('form-buy__input--success');
        spanSuccess.classList.remove('form-buy__span-success--active');

        objError[input.name] = false;
      } else {
        input.classList.add('form-buy__input--success');
        spanSuccess.classList.add('form-buy__span-success--active');

        objError[input.name] = true;
      }

      changeFormBtn();
    });
  }
}
