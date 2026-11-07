/* IRON: калькулятор КБЖУ + ИМТ, переключатель тарифов, выбор цели */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- КБЖУ ---------- */
  const f = $('#kbjuForm');
  function calc() {
    const v = (n) => f.querySelector(`[name=${n}]:checked`) ? f.querySelector(`[name=${n}]:checked`).value : f.querySelector(`[name=${n}]`).value;
    const sex = v('sex'), age = +v('age'), h = +v('h'), w = +v('w'), act = +v('act'), goal = +v('goal');
    if (!age || !h || !w) return;
    const bmr = 10 * w + 6.25 * h - 5 * age + (sex === 'm' ? 5 : -161);
    const kcal = Math.round(bmr * act * (1 + goal) / 10) * 10;
    const p = Math.round(w * (goal < 0 ? 2 : 1.8)), fat = Math.round(w * 0.9), c = Math.max(0, Math.round((kcal - p * 4 - fat * 9) / 4));
    $('#kcal').textContent = kcal.toLocaleString('ru-RU'); $('#mp').textContent = p; $('#mf').textContent = fat; $('#mc').textContent = c;
    const bmi = w / Math.pow(h / 100, 2);
    $('#bmi').textContent = bmi.toFixed(1);
    $('#bmiTxt').textContent = bmi < 18.5 ? 'недостаток веса' : bmi < 25 ? 'норма' : bmi < 30 ? 'избыточный вес' : 'ожирение';
    $('#bmiMark').style.left = Math.min(98, Math.max(0, ((bmi - 15) / 25) * 100)) + '%';
    $('#kbjuField').value = `${kcal} ккал (Б${p}/Ж${fat}/У${c}), ИМТ ${bmi.toFixed(1)}, вес ${w} кг, рост ${h} см`;
  }
  f.addEventListener('input', calc); f.addEventListener('change', calc); calc();

  /* ---------- Тарифы (меняйте цены здесь) ---------- */
  const PLANS = {
    gym: [
      { n: 'Разовая', price: 2500, per: 'за тренировку', f: ['60 минут в зале', 'Разбор техники', 'Рекомендации по питанию'] },
      { n: 'Пакет 12', price: 25200, per: '2 100 ₽ за тренировку', f: ['12 тренировок на 6 недель', 'План питания', 'Замеры и фото-контроль', 'Чат с тренером'], hot: true },
      { n: 'Пакет 24', price: 43200, per: '1 800 ₽ за тренировку', f: ['24 тренировки на 3 месяца', 'Всё из пакета 12', 'Анализ состава тела', 'Гарантия результата'] }
    ],
    online: [
      { n: 'Программа', price: 3900, per: 'разово', f: ['Индивидуальная программа на 4 недели', 'Видео упражнений', 'КБЖУ под цель'] },
      { n: 'Ведение', price: 8900, per: 'в месяц', f: ['Программа + коррекция каждую неделю', 'Проверка техники по видео', 'Чат 7 дней в неделю', 'План питания'], hot: true },
      { n: 'VIP', price: 15900, per: 'в месяц', f: ['Всё из «Ведения»', 'Созвон раз в неделю', 'Ответ в течение часа', 'Работа с привычками'] }
    ]
  };
  function render(mode) {
    $('#plans').innerHTML = PLANS[mode].map((p) => `<div class="plan ${p.hot ? 'hot' : ''}" style="animation:fadeUp .4s"><h3>${p.n}</h3><div class="price">${p.price.toLocaleString('ru-RU')} <small>₽</small></div><div class="per">${p.per}</div><ul>${p.f.map((x) => `<li>${x}</li>`).join('')}</ul><a href="#start" class="btn ${p.hot ? 'btn--primary' : 'btn--ghost'}" data-goal="${mode === 'online' ? 'Онлайн-ведение' : 'Похудение'}">Выбрать</a></div>`).join('');
  }
  $$('.switch button').forEach((b) => b.addEventListener('click', () => { $$('.switch button').forEach((x) => x.classList.toggle('on', x === b)); render(b.dataset.mode); }));
  render('gym');

  /* ---------- Выбор цели из карточек ---------- */
  document.addEventListener('click', (e) => { const g = e.target.closest('[data-goal]'); if (g) $('#goalSel').value = g.dataset.goal; });
})();
