/* НАСТРОЙКИ САЙТА — меняйте только этот файл */
window.SITE_CONFIG = {
  name: 'Дентика — стоматологическая клиника',
  phone: '+7 (343) 300-40-50',
  email: 'info@dentica-clinic.ru',
  address: 'Екатеринбург, ул. Малышева, 51',
  telegram: 'dentica_ekb',
  whatsapp: '73433004050',
  vk: 'dentica_ekb',
  hoursText: 'Пн–Пт 8:00 – 21:00 · Сб 9:00 – 18:00 · Вс выходной',
  hours: { 0: null, 1: [8, 21], 2: [8, 21], 3: [8, 21], 4: [8, 21], 5: [8, 21], 6: [9, 18] },
  map: { lat: 56.8355, lon: 60.6033, zoom: 16 },
  forms: { mode: 'demo', web3formsKey: '', endpoint: '/.netlify/functions/lead' },
  metrikaId: null,
  legal: { owner: 'ООО «Дентика»', inn: '6600000000', license: 'Л041-01021-66/00000000 от 12.03.2022' },
  promoEnds: null // дата окончания акции 'YYYY-MM-DD'; null — до конца текущего месяца
};
