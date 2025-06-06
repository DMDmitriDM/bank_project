import { el, mount } from 'redom';
import { router } from '../index.js';

import { validateFormLogin } from '../utils/validation.js';
import { autorization } from '../utils/api.js';
import { startSpinner, closeSpinner } from '../modal/load.js';
import errorModal from '../modal/error-modal.js';
import App from './app.js';

// ---------------------------------------- //

export default function renderAuthorization() {
  const token = localStorage.getItem('token');
  if (token !== null) {
    router.navigate('/accounts');

    return;
  }

  // ---------------------------------------- //
  // ------------ Создание страницы --------- //
  // ---------------------------------------- //

  const app = App.appCaseCreate();

  // ---------------------------------------- //

  const page = el('div.page-login.page-login--set.container');
  const formLogin = el('form.form-login.form-login--set', {
    id: 'id-form-login',
    autocomplete: 'off',
    novalidate: '',
  });

  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
  });

  mount(app, page);
  mount(page, formLogin);

  // ---------------------------------------- //

  const formLoginTitle = el('h1.form-login__title', 'Вход в аккаунт');

  mount(formLogin, formLoginTitle);

  // ---------------------------------------- //

  const formLoginBoxInput = el('div.form-login__box-inputs');
  // ---
  const boxInputLogin = el('div.form-login__box-input');
  const boxInputPassword = el('div.form-login__box-input');
  // ---
  const titleLogin = el('span.form-login__input-title', 'Логин');
  const inputLogin = el('input.form-login__input', {
    type: 'text',
    name: 'login',
    id: 'id-login-input',
    ['data-error']: 'id-login-error',
    ['data-success']: 'id-login-success',
  });
  const errorLogin = el('span.form-login__span-error', {
    id: 'id-login-error',
  });
  const successLogin = el('span.form-login__span-success', {
    id: 'id-login-success',
    textContent: 'Заполнено',
  });
  // ---
  const titlePassword = el('span.form-login__input-title', 'Пароль');
  const inputPassword = el('input.form-login__input', {
    type: 'text',
    name: 'password',
    id: 'id-password-input',
    ['data-error']: 'id-password-error',
    ['data-success']: 'id-password-success',
  });
  const errorPassword = el('span.form-login__span-error', {
    id: 'id-password-error',
  });
  const successPassword = el('span.form-login__span-success', {
    id: 'id-password-success',
    textContent: 'Заполнено',
  });
  // ---

  mount(boxInputLogin, titleLogin);
  mount(boxInputLogin, inputLogin);
  mount(boxInputLogin, errorLogin);
  mount(boxInputLogin, successLogin);

  mount(boxInputPassword, titlePassword);
  mount(boxInputPassword, inputPassword);
  mount(boxInputPassword, errorPassword);
  mount(boxInputPassword, successPassword);

  mount(formLoginBoxInput, boxInputLogin);
  mount(formLoginBoxInput, boxInputPassword);

  mount(formLogin, formLoginBoxInput);

  // ---------------------------------------- //

  const formLoginBoxBtn = el('div.form-login__box-btn');
  const formLoginBtn = el(
    'button.form-login__btn.blue-btn.btn-reset',
    'Войти',
    {
      id: 'id-form-login-btn',
      type: 'button',
      disabled: true,
    },
  );

  mount(formLoginBoxBtn, formLoginBtn);
  mount(formLogin, formLoginBoxBtn);

  // Нажатие на кнопку
  formLoginBtn.addEventListener('click', async () => {
    startSpinner();

    const result = await autorization(inputLogin.value, inputPassword.value);
    // console.log(result);

    if (result.error === 500 && result.catchLog !== null) {
      closeSpinner();

      errorModal('Ошибка сервера: ' + result.catchLog);
      return;
    }

    if (result.error === 'No such user') {
      closeSpinner();

      inputLogin.classList.remove('form-login__input--success');
      successLogin.classList.remove('form-login__span-success--active');

      inputLogin.classList.add('form-login__input--error');
      errorLogin.classList.add('form-login__span-error--active');
      errorLogin.textContent = 'Нет такого пользователя!';

      formLoginBtn.setAttribute('disabled', '');
      return;
    }

    if (result.error === 'Invalid password') {
      closeSpinner();

      inputPassword.classList.remove('form-login__input--success');
      successPassword.classList.remove('form-login__span-success--active');

      inputPassword.classList.add('form-login__input--error');
      errorPassword.classList.add('form-login__span-error--active');
      errorPassword.textContent = 'Неверный пароль!';

      formLoginBtn.setAttribute('disabled', '');
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

    localStorage.setItem('token', result.payload.token);

    router.navigate('/accounts');
    return;
  });

  // Работа инпутов
  inputWork();
}

// ---------------------------------------- //
// ------------ Работа инпутов ------------ //
// ---------------------------------------- //

function inputWork() {
  const objError = {
    login: false,
    password: false,
  };

  const arrInputs = document.querySelectorAll('.form-login__input');
  for (const input of arrInputs) {
    input.addEventListener('blur', () => {
      const valid = validateFormLogin[input.id](input.value);

      if (valid !== '') {
        input.classList.add('form-login__input--error');

        const spanError = document.getElementById(input.dataset.error);
        spanError.classList.add('form-login__span-error--active');
        spanError.textContent = valid;

        objError[input.name] = false;
      } else {
        objError[input.name] = true;
      }

      changeFormBtn();
    });

    input.addEventListener('input', () => {
      input.classList.remove('form-login__input--error');

      const spanError = document.getElementById(input.dataset.error);
      spanError.textContent = '';
      spanError.classList.remove('form-login__span-error--active');

      const spanSuccess = document.getElementById(input.dataset.success);

      const valid = validateFormLogin[input.id](input.value);

      if (valid !== '') {
        input.classList.remove('form-login__input--success');
        spanSuccess.classList.remove('form-login__span-success--active');

        objError[input.name] = false;
      } else {
        input.classList.add('form-login__input--success');
        spanSuccess.classList.add('form-login__span-success--active');

        objError[input.name] = true;
      }

      changeFormBtn();
    });
  }

  const formLoginBtn = document.getElementById('id-form-login-btn');
  function changeFormBtn() {
    for (const key in objError) {
      if (!objError[key]) {
        formLoginBtn.setAttribute('disabled', '');

        return;
      }
    }

    formLoginBtn.removeAttribute('disabled');
  }
}
