import { el, mount } from 'redom';
import ymaps from 'ymaps';

import { getAtms } from '../utils/api.js';

import { startSpinner, closeSpinner } from '../modal/load.js';
import { getAndTestToken, testResult } from './test/test.js';
import App from './app.js';
import renderHeader from './bricks/header.js';

export default async function renderAtms() {
  startSpinner();

  const token = getAndTestToken();
  if (token === null) {
    closeSpinner();
    return;
  }

  const result = await getAtms(token);
  if (!testResult(result)) {
    closeSpinner();
    return;
  }

  let arrBanks = result.payload;

  // ---------------------------------------- //
  // ------------ Создание страницы --------- //
  // ---------------------------------------- //

  const app = App.appCaseCreate();

  // ---------------------------------------- //

  renderHeader(app);

  const btnAtm = document.getElementById('id-nav-atm');
  btnAtm.setAttribute('disabled', '');

  // ---------------------------------------- //

  const main = el('main.main-atms.main-atms--set.container');
  mount(app, main);

  // ---------------------------------------- //

  const caption = el('section.caption-atms.caption-atms--set');
  const captionTitle = el('h1.caption-atms__title', 'Карта банкоматов');

  mount(caption, captionTitle);
  mount(main, caption);

  // ---------------------------------------- //

  const boxAtms = el('section.box-atms.box-atms--set');
  const mapAtms = el('div.box-atms__map', {
    id: 'id-atms-map',
  });
  mount(boxAtms, mapAtms);
  mount(main, boxAtms);

  const testLoad = await loadMapNew('id-atms-map', arrBanks);

  if (!testLoad) {
    mapAtms.textContent = 'Ошибка загрузки карты';
  }
  // ---------------------------------------- //

  closeSpinner();
}

const apikey = '';

async function loadMapNew(container, arrBanks) {
  if (apikey === '') {
    return false;
  }

  try {
    const maps = await ymaps.load(
      `https://api-maps.yandex.ru/2.1/?apikey=${apikey}&lang=ru_RU`,
    );

    const map = await new maps.Map(container, {
      center: [55.755864, 37.617698],
      zoom: 12,
      controls: ['rulerControl', 'trafficControl', 'typeSelector'],
    });

    for (const banck of arrBanks) {
      const myPlacemark = await new maps.Placemark(
        [banck.lat, banck.lon],
        {},
        {
          preset: 'islands#icon',
          iconColor: '#0095b6',
        },
      );

      await map.geoObjects.add(myPlacemark);
    }
    return true;
  } catch {
    return false;
  }
}
