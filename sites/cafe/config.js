/* НАСТРОЙКИ САЙТА — меняйте только этот файл (меню — в menu.js) */
window.SITE_CONFIG = {
  name: 'Зерно — кофейня и кухня',
  phone: '+7 (812) 555-01-02',
  email: 'hello@zerno-cafe.ru',
  address: 'Санкт-Петербург, ул. Рубинштейна, 8',
  telegram: 'zerno_spb',
  whatsapp: '79815550102',
  vk: 'zerno_spb',
  hoursText: 'Пн–Пт 8:00 – 22:00 · Сб–Вс 9:00 – 23:00',
  hours: { 0: [9, 23], 1: [8, 22], 2: [8, 22], 3: [8, 22], 4: [8, 22], 5: [8, 22], 6: [9, 23] },
  map: { lat: 59.9297, lon: 30.3451, zoom: 16 },
  forms: { mode: 'demo', web3formsKey: '', endpoint: '/.netlify/functions/lead' },
  metrikaId: null,
  legal: { owner: 'ООО «Зерно»', inn: '7800000000' },
  delivery: { min: 700, free: 2000, price: 199 } // мин. заказ, бесплатно от, стоимость доставки
};
