function validLogin(value) {
  if (value.length === 0) {
    return 'Вы не ввели логин!';
  }

  if (value.length < 6) {
    return 'Не менее 6 символов!';
  }

  if (/^[-_A-Za-z0-9]{6,}$/.test(value)) {
    return '';
  } else {
    return 'Не валидный логин!';
  }
}

function validPassword(value) {
  if (value.length === 0) {
    return 'Вы не ввели пароль!';
  }

  if (value.length < 6) {
    return 'Не менее 6 символов!';
  }

  if (/^[A-Za-z!0-9@#$&]{6,}$/.test(value)) {
    return '';
  } else {
    return 'Не валидный пароль!';
  }
}

export const validateFormLogin = {
  ['id-login-input']: validLogin,
  ['id-password-input']: validPassword,
};

// ---------------------------------- //

function validReceiver(value) {
  if (value.length === 0) {
    return 'Вы не ввели счёт пользователя!';
  }

  if (/^\d{15,30}$/.test(value)) {
    return '';
  } else {
    return 'От 15 до 30 цифр!';
  }
}

function validSum(value) {
  if (value.length === 0) {
    return 'Вы не сумму перевода!';
  }

  if (!/^((\d{1,20})|(\d{1,20}\.[0-9]{2}))$/.test(value)) {
    return 'Не валидная сумма!';
  }

  if (Number(value) * 100 === 0) {
    return 'Не валидная сумма!';
  }

  return '';
}

export const validateFormSend = {
  ['id-receiver-input']: validReceiver,
  ['id-sum-input']: validSum,
  ['id-buy-input']: validSum,
};
