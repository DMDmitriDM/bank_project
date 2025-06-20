## Приложение: "Банковская система хранения и операций"
Основной фунционал приложения:
* Форма входа пользователя
* Список счетов пользователя
* Просмотр информации о существующей карте
* Форма для перевода средств
* Подробная история баланса по карте
* Мониторинг курса валют и валютные переводы
* Страница отображения точек банкоматов на карте

### Предупреждение
* На данный момент это десктопная версия (от 1200px)
* Элементы dropdown, dropdown-check, dropdown-input, а также pagination  
сделаны "своими руками" и в дальнейшем планируется их изменение  
на версию как в моём репозитарии "elements".
 
### Необходимые требования
node.js версия не ниже 22.12.0
npm версия не ниже 10.9.0
При необходимости установить serve
npm install --global serve

### Установка и запуск проекта
1. Склонируйте данный репозиторий к себе на диск.

2. Из директории server выполните `npm i` для установки
и `npm start` для запуска сервера.
По умолчанию сервер слушает на 3000-ом порту localhost.

3. Из директории bank выполните `npm i` для установки.  
Установка может быть долгой из-за библиотеки cypress.

4. Из директории bank выполните команду `npm run dev` для
запуска проекта в режиме отладки. Затем откройте браузер
по адресу http://localhost:8080/.

5. Для создания продакшен проекта из директории bank
выполните команду `npm run build`.
Из директории dist выполните команду `npx serve -s -l 5000`
или с другим портом отличным от 3000.
Затем откройте браузер по адресу http://localhost:5000/.

### Логин и пароль
На данный момент доступен только вход в следующий аккаунт:
* Логин: `developer`
* Пароль: `skillbox`

### Тесты
1. Выполните запуск сервера и проекта в режиме отладки!!!
2. Для запуска тестов в GUI из директории bank выполните команду
`npm run cy:open` или `npx cypress open`
Доступны три теста:
- authorization.cy (Проверка на авторизацию)
- accounts.cy (Проверка на список счетов и создание нового счёта)
- account.cy (Проверка на возможность перевода денежных средств)

3. Для запуска тестов в CLI из директории bank выполните
поочерёдно или выборочно:
- `npx cypress run --spec "cypress/e2e/authorization.cy.js"`
- `npx cypress run --spec "cypress/e2e/accounts.cy.js"`
- `npx cypress run --spec "cypress/e2e/account.cy.js"`

Запуск всех тестов:
`npx cypress run`

Опция --browser даёт возможность провести тест в конкретном браузере
`npx cypress run --browser chrome --spec "cypress/e2e/authorization.cy.js"`

### Проблема запуска тестов
Тесты не запускаются с предупреждением в териминале:  
No version of Cypress is installed  
Please reinstall Cypress by running: cypress install  

Одно из возможных решений:  
npx cypress cache clear  
npx cypress install  

### eslint
Из директории bank выполните команду `npm run lint`.
