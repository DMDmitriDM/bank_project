// Получение строки "01 января 2000"
export function getStrDate(dateObj) {
  const year = String(dateObj.getFullYear());
  const month = dateObj.getMonth();

  const arrMonth = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const monthNew = arrMonth[month];

  const date = dateObj.getDate();
  const dateNew = date < 10 ? '0' + String(date) : String(date);
  return dateNew + ' ' + monthNew + ' ' + year;
}

// получение строки с месяцем
export function getMonthPart(month) {
  const arrMonth = [
    'янв',
    'фев',
    'мар',
    'апр',
    'май',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
  ];

  return arrMonth[month - 1];
}

// получение строки с датой dd.mm.yyyy
export function getStrPointDate(dateObj) {
  const year = String(dateObj.getFullYear());
  const month = dateObj.getMonth() + 1;
  const monthNew = month < 10 ? '0' + String(month) : String(month);
  const date = dateObj.getDate();
  const dateNew = date < 10 ? '0' + String(date) : String(date);
  return dateNew + '.' + monthNew + '.' + year;
}

// получение числа с датой yyyymmdd
export function getNumDate(dateObj) {
  const year = String(dateObj.getFullYear());
  const month = dateObj.getMonth() + 1;
  const monthNew = month < 10 ? '0' + String(month) : String(month);
  const date = dateObj.getDate();
  const dateNew = date < 10 ? '0' + String(date) : String(date);
  return Number(year + monthNew + dateNew);
}

// Получение последних записей
export function getLastTransactions(arr, n) {
  if (arr.length === 0) {
    return [];
  }

  let startPosition = Math.max(arr.length - n, 0);
  const resultArr = arr.slice(startPosition);

  return resultArr;
}

// Дополнение строки с дробным числом
export function getStrAfterPoint(str) {
  const numPoint = str.indexOf('.');

  if (numPoint === -1) {
    return str + '.00';
  }

  const strAfterPoint = str.slice(numPoint + 1);
  return strAfterPoint.length < 2 ? str + '0' : str;
}

// ---------------------------------- //

// строковое представление даты в objDate
function strToDate(strDate) {
  return new Date(Date.parse(strDate));
}

// получение строки с датой yyyym
function getStrYearM(dateObj) {
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  return String(year) + String(month);
}

export function getHistoryBalance(account, makeBalance, n, arrTransactions) {
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1 + 1;
  // + 1 для цикла

  let balance = Number(makeBalance.toFixed(2));
  const arrBalance = [];

  // const n = 6;
  for (let i = 0; i < n; i++) {
    month = month - 1;
    if (!month) {
      month = 12;
      year = year - 1;
    }

    const strYearMonth = String(year) + String(month);

    // здесь баланс на конец месяца
    // второй и последущие циклы от начала предыдущего
    const objBalance = {
      month: month,
      endBalance: balance,
      maxBalance: balance,
      startBalance: balance,
      debit: 0,
      credit: 0,
    };

    // Получаем массив транзакций одного месяца
    const arrAmount = arrTransactions.filter(
      (item) => getStrYearM(strToDate(item.date)) === strYearMonth,
    );

    arrAmount.reverse();

    // Получаем баланс на начало месяца и макс баланс за месяц
    for (const amount of arrAmount) {
      // Поступление на счёт
      if (account !== amount.from) {
        balance = Number((balance - amount.amount).toFixed(2));
        objBalance.debit = Number(
          (objBalance.debit + amount.amount).toFixed(2),
        );
      } else {
        // Списание со счёта
        balance = Number((balance + amount.amount).toFixed(2));
        objBalance.credit = Number(
          (objBalance.credit + amount.amount).toFixed(2),
        );
      }

      if (balance * 100 > objBalance.maxBalance * 100) {
        objBalance.maxBalance = balance;
      }
    }

    // Записываем баланс на начало месяца
    objBalance.startBalance = balance;

    // ---
    arrBalance.push(objBalance);
  }

  return arrBalance;
}

// отключить Tab & Enter
export function tabEnterOnOff(key) {
  if (key === 'off') {
    document.body.onkeydown = (evt) => {
      if (evt.key === 'Tab' || evt.key === 'Enter') {
        evt.preventDefault();
      }
    };
  } else if (key === 'on') {
    document.body.onkeydown = (evt) => {
      if (evt.key === 'Tab' || evt.key === 'Enter') {
        evt.key;
      }
    };
  }
}

function offTabEnter(event) {
  if (event.key === 'Tab' || event.key === 'Enter') {
    event.preventDefault();
  }
}

export function newTabEnterOnOff(key) {
  if (key === 'off') {
    document.body.addEventListener('keydown', offTabEnter);
  } else if (key === 'on') {
    document.body.removeEventListener('keydown', offTabEnter);
  }
}

export function setFocusOne(element) {
  setTimeout(() => {
    element.focus();
  }, 100);
}

// ловушка для фокуса по кругу тэбом
export function trapFocus(element) {
  const focusElements = [
    'a[href]:not([disabled])',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input[type="text"]:not([disabled])',
    'input[type="radio"]:not([disabled])',
    'input[type="checkbox"]:not([disabled])',
    'select:not([disabled])',
  ];

  const focusableEls = element.querySelectorAll(focusElements);
  const firstFocusableEl = focusableEls[0];
  const lastFocusableEl = focusableEls[focusableEls.length - 1];
  const KEYCODE_TAB = 9;

  element.addEventListener('keydown', (e) => {
    const isTabPressed = e.key === 'Tab' || e.keyCode === KEYCODE_TAB;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableEl) {
        lastFocusableEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableEl) {
        firstFocusableEl.focus();
        e.preventDefault();
      }
    }
  });
}
