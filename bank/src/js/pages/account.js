import { el, mount } from 'redom';
import { router } from '../index.js';

import { getAccount, transferFunds } from '../utils/api.js';
import { validateFormSend } from '../utils/validation.js';
import { getLastTransactions, getHistoryBalance } from '../utils/utils.js';
import dropdownInput from '../libr/dropdown-input.js';
import { getArrLocal, creatItemArrLocal } from '../libr/local-input.js';
import { startSpinner, closeSpinner } from '../modal/load.js';
import errorModal from '../modal/error-modal.js';
import { getAndTestToken, testResult } from './test/test.js';
import App from './app.js';
import renderHeader from './bricks/header.js';
import historyBlock from './bricks/history.js';
import dynamicsBlock from './bricks/dynamics.js';

export default async function renderAccount(id) {
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
    6,
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
  const captionTitle = el('h1.caption-account__title', 'Просмотр счёта');
  const captionBtn = el('button.caption-account__btn.blue-btn.btn-reset', {
    id: 'id-caption-account-btn',
    type: 'button',
  });
  const captionBtnSpan = el('span.caption-account__btn-span', {
    textContent: 'Вернуться назад',
  });

  captionBtn.addEventListener('click', () => {
    router.navigate('/accounts');
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

  const middle = el('section.middle-account.middle-account--set');
  mount(main, middle);

  // ---------------------------------------- //

  const formSend = el('form.form-send.form-send--set', {
    id: 'id-form-send',
    autocomplete: 'off',
    novalidate: '',
  });

  formSend.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  mount(middle, formSend);

  // ---
  const formSendTitle = el('h3.form-send__title', 'Новый перевод');
  mount(formSend, formSendTitle);

  const formSendBoxInput = el('div.form-send__box-inputs');
  const boxInputReceiver = el('div.form-send__box-input');
  const boxInputSum = el('div.form-send__box-input');

  mount(formSend, formSendBoxInput);
  mount(formSendBoxInput, boxInputReceiver);
  mount(formSendBoxInput, boxInputSum);

  // ---
  const titleSend = el('span.form-send__input-title', 'Номер счёта получателя');
  const inputSend = el('input.form-send__input', {
    type: 'text',
    name: 'receiver',
    id: 'id-receiver-input',
    ['data-error']: 'id-receiver-error',
    ['data-success']: 'id-receiver-success',
  });
  const errorSend = el('span.form-send__span-error', {
    id: 'id-receiver-error',
  });
  const successSend = el('span.form-send__span-success', {
    id: 'id-receiver-success',
    textContent: 'Заполнено',
  });

  inputSend.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.code === 'Enter') {
      event.preventDefault();
    }
  });

  mount(boxInputReceiver, titleSend);
  mount(boxInputReceiver, inputSend);
  mount(boxInputReceiver, errorSend);
  mount(boxInputReceiver, successSend);

  // ---
  const titleSum = el('span.form-send__input-title', 'Сумма перевода');
  const inputSum = el('input.form-send__input', {
    type: 'text',
    name: 'sum',
    id: 'id-sum-input',
    ['data-error']: 'id-sum-error',
    ['data-success']: 'id-sum-success',
  });
  const errorSum = el('span.form-send__span-error', {
    id: 'id-sum-error',
  });
  const successSum = el('span.form-send__span-success', {
    id: 'id-sum-success',
    textContent: 'Заполнено',
  });

  inputSum.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.code === 'Enter') {
      event.preventDefault();
    }
  });

  mount(boxInputSum, titleSum);
  mount(boxInputSum, inputSum);
  mount(boxInputSum, errorSum);
  mount(boxInputSum, successSum);

  // ---
  const formSendBoxBtn = el('div.form-send__box-btn');
  const formSendBtn = el('button.form-send__btn.blue-btn.btn-reset', {
    id: 'id-form-send-btn',
    type: 'button',
    disabled: true,
  });

  const formSendBtnSpan = el('span.form-send__btn-span', {
    textContent: 'Отправить',
  });

  // Перевод денег
  formSendBtn.addEventListener('click', async () => {
    startSpinner();

    const token = getAndTestToken();
    if (token === null) {
      closeSpinner();
      return;
    }

    const result = await transferFunds(
      account.account,
      inputSend.value,
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

    if (result.error === 'Invalid account from') {
      closeSpinner();

      errorModal('Ошибка : ' + result.error);
      return;
    }

    if (result.error === 'Invalid account to') {
      closeSpinner();

      inputSend.classList.remove('form-send__input--success');
      successSend.classList.remove('form-send__span-success--active');

      inputSend.classList.add('form-send__input--error');
      errorSend.classList.add('form-send__span-error--active');
      errorSend.textContent = 'Неверный счёт получателя!';

      formSendBtn.setAttribute('disabled', '');
      return;
    }

    if (result.error === 'Invalid amount') {
      closeSpinner();

      inputSum.classList.remove('form-send__input--success');
      successSum.classList.remove('form-send__span-success--active');

      inputSum.classList.add('form-send__input--error');
      errorSum.classList.add('form-send__span-error--active');
      errorSum.textContent = 'Неверная сумма!';

      formSendBtn.setAttribute('disabled', '');
      return;
    }

    if (result.error === 'Overdraft prevented') {
      closeSpinner();

      inputSum.classList.remove('form-send__input--success');
      successSum.classList.remove('form-send__span-success--active');

      inputSum.classList.add('form-send__input--error');
      errorSum.classList.add('form-send__span-error--active');
      errorSum.textContent = 'Недастаточно средств!';

      formSendBtn.setAttribute('disabled', '');
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
    await creatItemArrLocal(account.account, inputSend.value);
    // window.location.reload();
    renderAccount(id);
    // ---
    // closeSpinner();
  });

  mount(formSend, formSendBoxBtn);
  mount(formSendBoxBtn, formSendBtn);
  mount(formSendBtn, formSendBtnSpan);

  // Работа инпутов
  inputWork();

  // Работа инпута с автодополнением
  const arrStrInput = await getArrLocal(account.account);

  dropdownInput(boxInputReceiver, inputSend, 1, arrStrInput);

  // ---------------------------------------- //

  const tranferDynamics = el('div.transfer-dynamics.transfer-dynamics--set', {
    tabindex: '0',
    role: 'button',
    style: { cursor: 'pointer' },
  });
  mount(middle, tranferDynamics);

  tranferDynamics.addEventListener('click', () => {
    router.navigate(`/account-two/${account.account}`);
    return;
  });

  const dynamicsBox = dynamicsBlock(historyBalance);
  mount(tranferDynamics, dynamicsBox);

  // ---------------------------------------- //

  const historySection = el('section.history-account.history-account--set');
  mount(main, historySection);

  const arrLastTransactions = getLastTransactions(account.transactions, 10);
  arrLastTransactions.reverse();
  // ---
  // console.log(arrLastTransactions);

  const tranferHistory = el('div.transfer-history.transfer-history--set', {
    tabindex: '0',
    role: 'button',
    style: { cursor: 'pointer' },
  });
  mount(historySection, tranferHistory);

  tranferHistory.addEventListener('click', () => {
    router.navigate(`/account-two/${account.account}`);
    return;
  });

  const historyBox = historyBlock(account.account, arrLastTransactions, 0);
  mount(tranferHistory, historyBox);

  // ---------------------------------------- //

  closeSpinner();
}

// ---------------------------------------- //
// ------------ Работа инпутов ------------ //
// ---------------------------------------- //

function inputWork() {
  const objError = {
    receiver: false,
    sum: false,
  };

  const arrInputs = document.querySelectorAll('.form-send__input');
  for (const input of arrInputs) {
    input.addEventListener('blur', () => {
      const valid = validateFormSend[input.id](input.value);

      if (valid !== '') {
        input.classList.add('form-send__input--error');

        const spanError = document.getElementById(input.dataset.error);
        spanError.classList.add('form-send__span-error--active');
        spanError.textContent = valid;

        objError[input.name] = false;
      } else {
        objError[input.name] = true;
      }

      changeFormBtn();
    });

    input.addEventListener('input', () => {
      input.classList.remove('form-send__input--error');

      const spanError = document.getElementById(input.dataset.error);
      spanError.textContent = '';
      spanError.classList.remove('form-send__span-error--active');

      const spanSuccess = document.getElementById(input.dataset.success);

      const valid = validateFormSend[input.id](input.value);

      if (valid !== '') {
        input.classList.remove('form-send__input--success');
        spanSuccess.classList.remove('form-send__span-success--active');

        objError[input.name] = false;
      } else {
        input.classList.add('form-send__input--success');
        spanSuccess.classList.add('form-send__span-success--active');

        objError[input.name] = true;
      }

      changeFormBtn();
    });
  }

  const formSendBtn = document.getElementById('id-form-send-btn');
  function changeFormBtn() {
    for (const key in objError) {
      if (!objError[key]) {
        formSendBtn.setAttribute('disabled', '');

        return;
      }
    }

    formSendBtn.removeAttribute('disabled');
  }
}
