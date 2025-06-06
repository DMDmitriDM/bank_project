export function creatDropDown(parent, id, toggle, arrCheck, fun = null) {
  // загрузка dropdown

  const dropdownInnerHTML = `<div class="dropdown-check" id="dropdown-check-${id}">
  <button class="dropdown__toggle-check btn-reset" type="button">${toggle}</button>
  <div class="dropdown__menu-check"></div>
  </div>`;

  parent.innerHTML = dropdownInnerHTML;

  const dropdownContainer = document.querySelector(`#dropdown-check-${id}`);
  const dropdownToggle = document.querySelector(
    `#dropdown-check-${id} .dropdown__toggle-check`,
  );
  const dropdownMenu = document.querySelector(
    `#dropdown-check-${id} .dropdown__menu-check`,
  );

  for (const check of arrCheck) {
    const dropdownItem = document.createElement('button');
    dropdownItem.classList.add('dropdown__item-check', 'btn-reset');
    dropdownItem.setAttribute('type', 'button');
    dropdownItem.setAttribute('check', 'false');
    dropdownItem.textContent = check;

    dropdownMenu.append(dropdownItem);
  }

  // Работа dropdown

  //при потере фокуса меню
  dropdownMenu.addEventListener('focusout', () => {
    if (!dropdownContainer.classList.contains('dropdown-check--open')) {
      return;
    }

    setTimeout(() => {
      let close = true;

      const items = document.querySelectorAll(
        `#dropdown-check-${id} .dropdown__item-check`,
      );
      for (const item of items) {
        if (document.activeElement === item) {
          close = false;

          break;
        }
      }

      // console.log(close);
      if (close) {
        dropdownContainer.classList.remove('dropdown-check--open');
        dropdownMenu.classList.remove('dropdown__menu-check--open');
        document.documentElement.removeEventListener('click', eventClick);
      }
    }, 200);
  });

  // закрытие меню при клике не на шапку
  function eventClick(e) {
    if (e.target !== dropdownToggle) {
      dropdownContainer.classList.remove('dropdown-check--open');
      dropdownMenu.classList.remove('dropdown__menu-check--open');

      document.documentElement.removeEventListener('click', eventClick);
    }
  }

  // нажатие на шапку
  dropdownToggle.addEventListener('click', () => {
    // открыто
    if (dropdownContainer.classList.contains('dropdown-check--open')) {
      dropdownContainer.classList.remove('dropdown-check--open');
      dropdownMenu.classList.remove('dropdown__menu-check--open');

      document.documentElement.removeEventListener('click', eventClick);
      // закрыто
    } else {
      dropdownContainer.classList.add('dropdown-check--open');
      dropdownMenu.classList.add('dropdown__menu-check--open');

      document.documentElement.addEventListener('click', eventClick);
    }
  });

  // собитие нажатие на item - button
  const items = document.querySelectorAll(
    `#dropdown-check-${id} .dropdown__item-check`,
  );
  for (const [i, item] of items.entries()) {
    item.addEventListener('click', (e) => {
      dropdownToggle.focus();

      if (fun) {
        fun(i);
      }

      if (e.target.getAttribute('check') === 'true') {
        return;
      }

      for (const item of items) {
        item.setAttribute('check', 'false');
        item.classList.remove('dropdown__item-check--check');
      }

      e.target.setAttribute('check', 'true');
      e.target.classList.add('dropdown__item-check--check');
    });
  }
}

// --- //

export function setDropDown(id, num) {
  const items = document.querySelectorAll(
    `#dropdown-check-${id} .dropdown__item-check`,
  );

  if (!items || items.length === 0) {
    return;
  }

  for (const [i, item] of items.entries()) {
    if (i === num) {
      item.setAttribute('check', 'true');
      item.classList.add('dropdown__item-check--check');
    } else {
      item.setAttribute('check', 'false');
      item.classList.remove('dropdown__item-check--check');
    }
  }
}

export function getDropDown(id) {
  const items = document.querySelectorAll(
    `#dropdown-check-${id} .dropdown__item-check`,
  );

  if (!items || items.length === 0) {
    return null;
  }

  for (const [i, item] of items.entries()) {
    if (item.getAttribute('check') === 'true') {
      return i;
    }
  }
}
