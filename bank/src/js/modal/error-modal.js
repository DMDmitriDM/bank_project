import { el, mount } from 'redom';

import { setFocusOne, trapFocus } from '../utils/utils.js';

export default function errorModal(message) {
  const body = window.document.body;

  const activeElement = document.activeElement;

  if (!document.getElementById('id-error-modal')) {
    const errorModal = el('div.error-modal.error-modal--set', {
      id: 'id-error-modal',
    });

    mount(body, errorModal);
  }

  const errorModal = document.getElementById('id-error-modal');
  errorModal.innerHTML = '';

  const errorModalBox = el('div.error-modal__box.container', {
    id: 'id-error-modal-box',
  });

  const errorModalTitle = el('h2.error-modal__title', {
    id: 'id-error-modal-title',
  });

  const errorModalBtn = el('button.error-modal__btn.blue-btn.btn-reset', 'Ок', {
    id: 'id-error-modal-btn',
  });
  errorModalBtn.addEventListener('click', () => {
    body.classList.remove('stop-scroll');
    errorModal.classList.remove('error-modal--active');
    errorModal.innerHTML = '';
    if (activeElement.tagName === 'BUTTON') {
      setFocusOne(activeElement);
    }
  });

  mount(errorModalBox, errorModalTitle);
  mount(errorModalBox, errorModalBtn);
  mount(errorModal, errorModalBox);

  errorModalTitle.textContent = message;
  errorModal.classList.add('error-modal--active');

  setFocusOne(errorModalBtn);
  trapFocus(errorModalBox);

  body.classList.add('stop-scroll');
  const scroll = window.scrollY;
  errorModal.style.top = `${scroll}px`;
}
