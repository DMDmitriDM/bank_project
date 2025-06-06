import { el, setChildren, mount } from 'redom';

import App from './app.js';

export default function errorPage(errStr) {
  const app = App.appCaseCreate();

  const errorPage = el('div.error-page.error-page--set.container');
  const titleSpinner = el('h2.error-page__title', {
    textContent: errStr,
  });

  const btnPage = el(
    'button.error-page__btn.blue-btn.btn-reset',
    'Перезагрузить',
  );

  btnPage.addEventListener('click', () => {
    window.location.reload();
  });

  mount(errorPage, titleSpinner);
  mount(errorPage, btnPage);
  setChildren(app, errorPage);
}
