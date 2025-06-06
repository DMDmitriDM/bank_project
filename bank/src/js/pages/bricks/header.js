import { el, mount } from 'redom';
import { router } from '../../index.js';

export default function renderHeader(app) {
  const header = el('header.header.header--set.container');
  mount(app, header);

  const logo = el('a.header__logo.link-reset', 'Coin.', {
    href: '#',
  });
  const nav = el('nav.header__nav.nav.nav--set');

  const navBtnAtm = el('button.nav__btn.btn-reset', {
    textContent: 'Банкоматы',
    id: 'id-nav-atm',
    type: 'button',
  });

  const navBtnAccounts = el('button.nav__btn.btn-reset', {
    textContent: 'Счета',
    id: 'id-nav-accounts',
    type: 'button',
  });

  const navBtnCurrency = el('button.nav__btn.btn-reset', {
    textContent: 'Валюта',
    id: 'id-nav-currency',
    type: 'button',
  });

  const navBtnExit = el('button.nav__btn.btn-reset', {
    textContent: 'Выйти',
    id: 'id-nav-exit',
    type: 'button',
  });

  mount(header, logo);
  mount(nav, navBtnAtm);
  mount(nav, navBtnAccounts);
  mount(nav, navBtnCurrency);
  mount(nav, navBtnExit);
  mount(header, nav);

  navBtnAtm.addEventListener('click', () => {
    router.navigate('/atms');
    return;
  });

  navBtnAccounts.addEventListener('click', () => {
    router.navigate('/accounts');
    return;
  });

  navBtnCurrency.addEventListener('click', () => {
    router.navigate('/currency');
    return;
  });

  navBtnExit.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('sort');
    router.navigate('/');
    return;
  });
}
