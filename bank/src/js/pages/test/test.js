import { router } from '../../index.js';
import errorModal from '../../modal/error-modal.js';
import errorPage from '../error-page.js';

export function getAndTestToken() {
  const token = localStorage.getItem('token');

  if (token === null) {
    errorModal('Ошибка авторизации. Введите логин и пароль!');
    localStorage.removeItem('sort');

    router.navigate('/');
    return null;
  } else {
    return token;
  }
}

export function testResult(result) {
  if (result.error === 500 && result.catchLog !== null) {
    const errStr = `Ошибка сервера: ${result.catchLog}. Попробуйте перезагрузить страницу!`;
    errorPage(errStr);

    return false;
  }

  if (result.error === 'Unauthorized') {
    localStorage.removeItem('token');
    localStorage.removeItem('sort');

    errorModal('Ошибка авторизации. Введите логин и пароль!');
    router.navigate('/');

    return false;
  }

  if (result.error !== '') {
    const errStr =
      'Ошибка: ' + result.error + '. Попробуйте перезагрузить страницу!';
    errorPage(errStr);

    return false;
  }

  if (result.payload === null) {
    const errStr =
      'Ошибка: Невозможно получить данные! Попробуйте перезагрузить страницу!';
    errorPage(errStr);

    return false;
  }

  return true;
}
