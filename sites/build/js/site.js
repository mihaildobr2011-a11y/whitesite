/* ПрофСтрой: калькулятор ремонта (цены — в config.js), фильтр объектов, прогресс этапов */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.SITE_CONFIG || {};
  const rub = (n) => (Math.round(n / 1000) * 1000).toLocaleString('ru-RU') + ' ₽';
  const f = $('#calcF');

  /* ---------- Калькулятор ---------- */
  $('#opts').innerHTML = (C.options || []).map((o, i) => `<label><input type="checkbox" value="${i}">${o.n}</label>`).join('');
  const NAMES = { cosmetic: 'Косметический', capital: 'Капитальный', design: 'Дизайнерский' };
  const DAYS = { cosmetic: 0.45, capital: 0.95, design: 1.4 };
  function calc() {
    const obj = f.querySelector('[name=obj]:checked').value, type = f.querySelector('[name=type]:checked').value, area = +f.querySelector('[name=area]').value;
    $('#areaOut').textContent = area + ' м²';
    let base = C.rates[type] * area * (obj === 'new' ? C.newBuildK : 1);
    const opts = $$('#opts input:checked').map((i) => C.options[+i.value]);
    const extra = opts.reduce((s, o) => s + (o.fixed || o.perM2 * area), 0);
    const total = base + extra;
    $('#sum').textContent = rub(total);
    $('#perM').textContent = rub(total / area).replace(' ₽', '') + ' ₽ за м²';
    $('#brk').innerHTML = `<div><span>Работы</span><b>${rub(base * 0.62)}</b></div><div><span>Черновые материалы</span><b>${rub(base * 0.38)}</b></div>` + (extra ? `<div><span>Доп. услуги (${opts.length})</span><b>${rub(extra)}</b></div>` : '');
    const days = Math.round(Math.max(14, area * DAYS[type] + (obj === 'old' ? 7 : 0) + 10));
    $('#term').textContent = days;
    $('#calcField').value = `${obj === 'new' ? 'Новостройка' : 'Вторичка'}, ${area} м², ${NAMES[type]}${opts.length ? ', + ' + opts.map((o) => o.n).join(', ') : ''} → ${rub(total)}, ~${days} дн.`;
  }
  f.addEventListener('input', calc); f.addEventListener('change', calc); calc();

  /* ---------- Фильтр объектов ---------- */
  $$('.pf-filter button').forEach((b) => b.addEventListener('click', () => {
    $$('.pf-filter button').forEach((x) => x.classList.toggle('active', x === b));
    $$('.pf-item').forEach((it) => it.classList.toggle('hide', b.dataset.f !== 'all' && it.dataset.cat !== b.dataset.f));
  }));

  /* ---------- Прогресс-линия этапов ---------- */
  const box = $('#stagesBox'), line = $('.line', box), st = $$('.stage', box);
  function prog() {
    const r = box.getBoundingClientRect(), mid = innerHeight * 0.6;
    const p = Math.min(1, Math.max(0, (mid - r.top) / r.height));
    line.style.height = p * (r.height - 20) + 'px';
    st.forEach((s) => s.classList.toggle('on', s.getBoundingClientRect().top + 29 < mid));
  }
  addEventListener('scroll', prog, { passive: true }); prog();

  /* ---------- Шапка: светлый текст на тёмном герое ---------- */
  const h = $('.header');
  const hc = () => { h.style.color = scrollY > 30 ? '' : '#fff'; };
  addEventListener('scroll', hc, { passive: true }); hc();
})();
