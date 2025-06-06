export default function dropdownInput(inputBox, input, id, arrString) {
  if (getComputedStyle(inputBox).position !== 'relative') {
    inputBox.style.position = 'relative';
  }

  if (!inputBox.classList.contains('input-auto-box')) {
    inputBox.classList.add('input-auto-box');
  }

  const inputMenu = document.createElement('div');
  inputMenu.classList.add('input-auto-menu');
  inputMenu.setAttribute('id', `id-input-auto-menu-${id}`);
  inputBox.append(inputMenu);

  // inputMenu.style.position = 'absolute';
  // inputMenu.style.zIndex = '3';
  // inputMenu.style.left = '0px';
  // inputMenu.style.top = input.offsetHeight + 'px';

  const stuffer = document.createElement('div');
  stuffer.classList.add('input-auto-menu-stuffer');
  inputMenu.append(stuffer);

  for (const str of arrString) {
    const btnMenu = document.createElement('button');
    btnMenu.classList.add('input-auto-menu-btn', 'btn-reset');
    btnMenu.textContent = str;

    stuffer.append(btnMenu);
  }

  let render = true;

  // ----------------------------------------- //

  // закрытие меню при клике не на шапку
  function eventClick(e) {
    if (e.target !== input) {
      closeDropdown();
      document.documentElement.removeEventListener('click', eventClick);
    }
  }

  // ----------------------------------------- //

  //при потере фокуса меню
  inputMenu.addEventListener('focusout', () => {
    if (!inputMenu.classList.contains('input-auto-menu--open')) {
      return;
    }

    setTimeout(() => {
      let close = true;

      const items = stuffer.children;
      for (const item of items) {
        if (document.activeElement === item) {
          close = false;

          break;
        }
      }

      if (close) {
        closeDropdown();
        document.documentElement.removeEventListener('click', eventClick);
      }
    }, 200);
  });

  // ----------------------------------------- //

  function renderMenu(inputValue) {
    const arrBtn = stuffer.children;

    let count = arrBtn.length;
    for (const btn of arrBtn) {
      // не содержит
      if (!btn.textContent.toLowerCase().includes(inputValue.toLowerCase())) {
        btn.classList.remove('input-auto-menu-btn--open');
        count--;
        // содержит
      } else {
        btn.classList.add('input-auto-menu-btn--open');
      }
    }

    // Закрываем
    if (!count) {
      closeDropdown();
      document.documentElement.removeEventListener('click', eventClick);
      // Открываем
    } else {
      openDropdown();
      document.documentElement.addEventListener('click', eventClick);
    }
  }

  // ----------------------------------------- //

  input.addEventListener('input', () => {
    if (!render) {
      render = true;
      return;
    }

    renderMenu(input.value);

    // if (input.value === '') {
    //   closeDropdown();

    //   return;
    // }

    // renderMenu(input.value);
  });

  // По шапке
  input.addEventListener('click', () => {
    if (!arrString.length) {
      return;
    }

    openOrClose();
  });

  input.addEventListener('keypress', (event) => {
    if (!arrString.length) {
      return;
    }

    if (event.key === 'Enter' || event.code === 'Enter') {
      openOrClose();
    }
  });

  function openOrClose() {
    // Открываем
    if (!inputMenu.classList.contains('input-auto-menu--open')) {
      // openDropdown();
      renderMenu('');
      document.documentElement.addEventListener('click', eventClick);
      // Закрываем
    } else {
      closeDropdown();
      document.documentElement.removeEventListener('click', eventClick);
    }
  }

  function openDropdown() {
    inputMenu.classList.add('input-auto-menu--open');
    inputBox.classList.add('input-auto-box--open');
  }

  function closeDropdown() {
    inputMenu.classList.remove('input-auto-menu--open');
    inputBox.classList.remove('input-auto-box--open');
  }

  // ----------------------------------------- //

  const arrBtn = stuffer.children;
  for (const btn of arrBtn) {
    btn.addEventListener('click', () => {
      input.focus();
      input.value = btn.textContent;

      // для сброса span success или error
      render = false;
      const event = new Event('input');
      input.dispatchEvent(event);
    });
  }

  // end function dropdownInput
}
