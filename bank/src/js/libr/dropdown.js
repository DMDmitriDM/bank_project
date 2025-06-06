export function creatDropDown(parent, id, arrItems, toggle = null, fun = null) {
  // ---------------- загрузка dropdown ---------------- //
  // ------------------------------------------------- //
  const dropdown = `<div class="dropdown" id="dropdown-${id}">
  <button class="dropdown__toggle btn-reset"></button>
  <div class="dropdown__menu">
  </div>
  </div>`;

  parent.innerHTML = dropdown;

  const dropdownContainer = document.querySelector(`#dropdown-${id}`);
  const dropdownToggle = document.querySelector(
    `#dropdown-${id} .dropdown__toggle`,
  );
  const dropdownMenu = document.querySelector(
    `#dropdown-${id} .dropdown__menu`,
  );

  // заполняем все из списка
  for (const item of arrItems) {
    const btnItem = document.createElement('button');
    btnItem.classList.add('dropdown__item', 'btn-reset');
    btnItem.textContent = item;
    dropdownMenu.append(btnItem);
  }

  if (toggle === null) {
    dropdownToggle.textContent = arrItems[0];
    dropdownToggle.setAttribute('data-idtoggle', '0');
    dropdownMenu.children[0].style.display = 'none';
  } else {
    dropdownToggle.textContent = toggle;
    dropdownToggle.setAttribute('data-idtoggle', '-1');
  }

  // ---------------- работа dropdown ---------------- //
  // ------------------------------------------------- //

  // закрытие меню при клике не на шапку
  function closeClick(e) {
    if (e.target !== dropdownToggle) {
      dropdownContainer.classList.remove('dropdown--open');
      dropdownMenu.classList.remove('dropdown__menu--open');

      document.documentElement.removeEventListener('click', closeClick);
    }
  }

  // нажатие на шапку
  dropdownToggle.addEventListener('click', () => {
    // открыто
    if (dropdownContainer.classList.contains('dropdown--open')) {
      dropdownContainer.classList.remove('dropdown--open');
      dropdownMenu.classList.remove('dropdown__menu--open');

      document.documentElement.removeEventListener('click', closeClick);
      // закрыто
    } else {
      dropdownContainer.classList.add('dropdown--open');
      dropdownMenu.classList.add('dropdown__menu--open');

      document.documentElement.addEventListener('click', closeClick);
    }
  });

  // нажатие на список меню
  const items = document.querySelectorAll(`#dropdown-${id} .dropdown__item`);
  for (const [i, item] of items.entries()) {
    item.addEventListener('click', () => {
      dropdownToggle.focus();

      const idToggle = dropdownToggle.getAttribute('data-idtoggle');
      item.style.display = 'none';
      // первый раз когда в шапке название не из списка а тоглл
      if (idToggle !== '-1') {
        items[Number(idToggle)].style.display = 'block';
      }
      // ---
      dropdownToggle.textContent = item.textContent;
      dropdownToggle.setAttribute('data-idtoggle', `${i}`);

      if (fun) {
        fun(item.textContent);
      }
    });
  }

  //при потере фокуса меню
  dropdownMenu.addEventListener('focusout', () => {
    if (!dropdownContainer.classList.contains('dropdown--open')) {
      return;
    }

    setTimeout(() => {
      let close = true;

      const items = document.querySelectorAll(
        `#dropdown-${id} .dropdown__item`,
      );
      for (const item of items) {
        if (document.activeElement === item) {
          close = false;

          break;
        }
      }

      if (close) {
        dropdownContainer.classList.remove('dropdown--open');
        dropdownMenu.classList.remove('dropdown__menu--open');
        document.documentElement.removeEventListener('click', closeClick);
      }
    }, 200);
  });
}

// --- //

export function getValueDropDown(id) {
  const dropdownToggle = document.querySelector(
    `#dropdown-${id} .dropdown__toggle`,
  );
  return dropdownToggle.textContent;
}

// --- //

export function setValueDropDown(id, name) {
  const dropdownToggle = document.querySelector(
    `#dropdown-${id} .dropdown__toggle`,
  );
  const items = document.querySelectorAll(`#dropdown-${id} .dropdown__item`);

  // проверка
  let itError = true;
  for (const item of items) {
    if (item.textContent === name) {
      itError = false;
    }
  }

  if (itError) {
    return;
  }

  for (const [i, item] of items.entries()) {
    if (item.textContent === name) {
      item.style.display = 'none';
      dropdownToggle.textContent = item.textContent;
      dropdownToggle.setAttribute('data-idtoggle', `${i}`);
    } else {
      item.style.display = 'block';
    }
  }
}
