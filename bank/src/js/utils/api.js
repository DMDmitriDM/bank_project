// Авторизация пользователя.
export async function autorization(login, password) {
  try {
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      body: JSON.stringify({
        login,
        password,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Возвращает список счетов пользователя.
export async function getAccounts(token) {
  try {
    const response = await fetch('http://localhost:3000/accounts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Метод создаёт для пользователя новый счёт, тело запроса не важно.
export async function createAccount(token) {
  try {
    const response = await fetch('http://localhost:3000/create-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Возвращает подробную информацию о счёте пользователя
export async function getAccount(id, token) {
  try {
    const response = await fetch(`http://localhost:3000/account/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Возвращает список точек, отмечающих места банкоматов.
export async function getAtms(token) {
  try {
    const response = await fetch('http://localhost:3000/banks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Перевод средств со счёта на счёт.
export async function transferFunds(from, to, amount, token) {
  try {
    const response = await fetch('http://localhost:3000/transfer-funds', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Массив со списком кодов валют.
export async function getCurrwncies(token) {
  try {
    const response = await fetch('http://localhost:3000/all-currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Метод возвращает список валютных счетов текущего пользователя.
export async function getCurrencyAccounts(token) {
  try {
    const response = await fetch('http://localhost:3000/currencies', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// Метод совершения валютного обмена.
export async function buyCurrency(from, to, amount, token) {
  try {
    const response = await fetch('http://localhost:3000/currency-buy', {
      method: 'POST',
      body: JSON.stringify({
        from,
        to,
        amount,
      }),
      headers: {
        'Content-Type': 'application/json',
        authorization: `Basic ${token}`,
      },
    });
    const result = await response.json();

    return { payload: result.payload, error: result.error, catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}

// websocket-стрим об изменении курса обмена валют.
export async function getSocketCurrency() {
  try {
    const ws = new WebSocket('ws://localhost:3000/currency-feed');

    return { payload: ws, error: '', catchLog: null };
  } catch (e) {
    return { payload: null, error: 500, catchLog: e.message };
  }
}
