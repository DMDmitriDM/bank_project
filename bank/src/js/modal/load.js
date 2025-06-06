import { el, mount } from 'redom';

import { newTabEnterOnOff } from '../utils/utils.js';

export function startSpinner() {
  if (!document.getElementById('id-spinner')) {
    const body = window.document.body;

    const spinner = el('div.spinner.spinner--set', {
      id: 'id-spinner',
    });

    const boxSpinner = el('div.spinner__box.container');

    const imgSpiner = el('div.spiner_box-img');

    mount(boxSpinner, imgSpiner);
    mount(spinner, boxSpinner);

    mount(body, spinner);
  }

  const spinner = document.getElementById('id-spinner');
  if (!spinner.classList.contains('spinner--active')) {
    spinner.classList.add('spinner--active');

    const body = window.document.body;
    body.classList.add('stop-scroll');
    const scroll = window.scrollY;
    spinner.style.top = `${scroll}px`;

    newTabEnterOnOff('off');
  }
}

export function closeSpinner() {
  const spinner = document.getElementById('id-spinner');
  spinner.classList.remove('spinner--active');

  const body = window.document.body;
  body.classList.remove('stop-scroll');
  newTabEnterOnOff('on');
}
