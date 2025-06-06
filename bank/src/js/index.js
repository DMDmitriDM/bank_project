import 'babel-polyfill';

import '../css/fonts.css';
import '../css/normalize.css';
import '../scss/main.scss';

import createIcoLink from './pages/bricks/create-ico.js';

import Navigo from 'navigo';
export const router = new Navigo('/');

// ---------------------------------------- //

import renderAuthorization from './pages/authorization.js';
import renderAccounts from './pages/accounts.js';
import renderAccount from './pages/account.js';
import renderAccountTwo from './pages/account-two.js';
import renderAtms from './pages/atms.js';
import renderCurrency from './pages/currency.js';

// ---------------------------------------- //

document.addEventListener('DOMContentLoaded', () => {
  createIcoLink();

  router.on('/', () => {
    renderAuthorization();
  });

  router.on('/accounts', () => {
    renderAccounts();
  });

  router.on('/atms', () => {
    renderAtms();
  });

  router.on('/account/:id', ({ data: { id } }) => {
    renderAccount(id);
  });

  router.on('/account-two/:id', ({ data: { id } }) => {
    renderAccountTwo(id);
  });

  router.on('/currency', () => {
    renderCurrency();
  });

  router.resolve();
});
