/* Дентика: таймер акции, калькулятор лечения, фильтр врачей, версия для слабовидящих */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.SITE_CONFIG || {};
  const rub = (n) => Math.round(n).toLocaleString('ru-RU') + ' ₽';

  /* ---------- Таймер акции ---------- */
  const end = C.promoEnds ? new Date(C.promoEnds + 'T23:59:59') : (() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth() + 1, 1); })();
  const tick = () => {
    let s = Math.max(0, (end - new Date()) / 1000); const d = Math.floor(s / 86400); s %= 86400; const h = Math.floor(s / 3600); s %= 3600; const m = Math.floor(s / 60); s = Math.floor(s % 60);
    $('#timer').innerHTML = [[d, 'дн'], [h, 'час'], [m, 'мин'], [s, 'сек']].map(([v, l]) => `<div>${String(v).padStart(2, '0')}<small>${l}</small></div>`).join('');
  };
  tick(); setInterval(tick, 1000);

  /* ---------- Лицензия из config ---------- */
  const lic = (C.legal && C.legal.license) || ''; $('#licNum').textContent = lic ? '№ ' + lic : ''; $('#licNum2').textContent = lic ? '№ ' + lic : '';

  /* ---------- Калькулятор (цены меняйте здесь) ---------- */
  const ITEMS = [
    { n: 'Консультация + 3D-снимок', d: 'КЛКТ одной челюсти', p: 0, unit: false },
    { n: 'Профессиональная гигиена', d: 'Air Flow + ультразвук + фторирование', p: 4500, unit: false },
    { n: 'Лечение кариеса', d: 'светоотверждаемая пломба', p: 3900, unit: true },
    { n: 'Лечение каналов', d: 'под микроскопом, за зуб', p: 9800, unit: true },
    { n: 'Имплант Osstem под ключ', d: 'имплант + абатмент + коронка', p: 52000, unit: true },
    { n: 'Коронка из циркония', d: 'CAD/CAM изготовление', p: 24000, unit: true },
    { n: 'Отбеливание ZOOM 4', d: 'за одно посещение', p: 22000, unit: false },
    { n: 'Элайнеры', d: 'курс лечения', p: 189000, unit: false }
  ];
  const sel = {};
  $('#calcList').innerHTML = ITEMS.map((it, i) => `<label class="ci" data-i="${i}"><input type="checkbox"><div><b>${it.n}</b><small>${it.d}</small></div>${it.unit ? `<span class="stepper"><button type="button" data-m>−</button><span>1</span><button type="button" data-p>+</button></span>` : '<span></span>'}<span class="pr">${it.p ? rub(it.p) : 'бесплатно'}</span></label>`).join('');
  $('#calcList').addEventListener('click', (e) => {
    const row = e.target.closest('.ci'); if (!row) return; const i = +row.dataset.i;
    if (e.target.closest('[data-p],[data-m]')) { e.preventDefault(); sel[i] = Math.max(1, Math.min(28, (sel[i] || 1) + (e.target.closest('[data-p]') ? 1 : -1))); $('.stepper span', row).textContent = sel[i]; calc(); }
  });
  $('#calcList').addEventListener('change', (e) => { const row = e.target.closest('.ci'); const i = +row.dataset.i; if (e.target.checked) sel[i] = sel[i] || 1; else delete sel[i]; row.classList.toggle('on', e.target.checked); calc(); });
  function calc() {
    const keys = Object.keys(sel), sum = keys.reduce((s, k) => s + ITEMS[k].p * sel[k], 0);
    $('#calcSum').textContent = rub(sum);
    $('#calcCount').textContent = keys.length ? `Выбрано процедур: ${keys.length}` : 'Выберите процедуры';
    $('#calcMo').textContent = rub(sum / 12); $('#calcTax').textContent = rub(Math.min(sum, 150000) * 0.13);
    $('#calcField').value = keys.map((k) => ITEMS[k].n + (ITEMS[k].unit ? ' ×' + sel[k] : '')).join('; ') + (keys.length ? ' — ' + rub(sum) : '');
  }
  calc();

  /* ---------- Фильтр врачей ---------- */
  $$('.filter button').forEach((b) => b.addEventListener('click', () => {
    $$('.filter button').forEach((x) => x.classList.toggle('active', x === b));
    $$('#docs .doc').forEach((d) => d.classList.toggle('hide', b.dataset.f !== 'all' && d.dataset.cat !== b.dataset.f));
  }));
  $$('[data-doc]').forEach((a) => a.addEventListener('click', () => { $('#docSel').value = a.dataset.doc; }));

  /* ---------- Версия для слабовидящих (запоминается) ---------- */
  const btn = $('#a11yBtn');
  const set = (on) => { document.body.classList.toggle('a11y', on); btn.setAttribute('aria-pressed', on); btn.textContent = on ? '👁 Обычная версия' : '👁 Версия для слабовидящих'; try { localStorage.setItem('a11y', on ? 1 : ''); } catch (e) {} };
  btn.onclick = () => set(!document.body.classList.contains('a11y'));
  try { if (localStorage.getItem('a11y')) set(true); } catch (e) {}
})();
