/* Репетитор: тест уровня, калькулятор стоимости, расписание свободных окон */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.SITE_CONFIG || {};
  const rub = (n) => Math.round(n).toLocaleString('ru-RU') + ' ₽';

  /* ---------- ТЕСТ УРОВНЯ (вопросы можно менять) ---------- */
  const Q = [
    { q: 'Чему равно 15% от 240?', a: ['36', '24', '32', '40'], r: 0 },
    { q: 'Решите уравнение: 3x − 7 = 11', a: ['x = 4', 'x = 6', 'x = 5', 'x = 18'], r: 1 },
    { q: 'Сумма углов треугольника равна…', a: ['360°', '90°', '180°', '270°'], r: 2 },
    { q: 'Вычислите: 2⁵ − 3²', a: ['23', '1', '19', '25'], r: 0 },
    { q: 'log₂ 64 = ?', a: ['8', '6', '32', '4'], r: 1 }
  ];
  const box = $('#quizBox'); let qi = 0, score = 0;
  function renderQ() {
    if (qi >= Q.length) return result();
    const it = Q[qi];
    box.innerHTML = `<div class="q-progress"><i style="width:${(qi / Q.length) * 100}%"></i></div><div class="q-count">Вопрос ${qi + 1} из ${Q.length}</div><div class="q-text">${it.q}</div><div class="q-opts">${it.a.map((a, i) => `<button class="q-opt" data-i="${i}">${a}</button>`).join('')}</div>`;
  }
  function result() {
    const lv = score >= 5 ? ['Отличный уровень!', 'Готовы к задачам второй части ЕГЭ. Сфокусируемся на 80+ баллах.'] : score >= 3 ? ['Хорошая база', 'Есть пробелы, которые закроем за 1–2 месяца. Цель 70+ реальна.'] : ['Начнём с фундамента', 'Повторим ключевые темы спокойно и по шагам — результат придёт быстро.'];
    $('#quizField').value = `${score} из ${Q.length} — ${lv[0]}`;
    box.innerHTML = `<div class="q-progress"><i style="width:100%"></i></div><div class="q-result"><div class="q-count">Ваш результат</div><div class="q-score">${score}/${Q.length}</div><h3 style="font-size:22px;margin:10px 0 6px">${lv[0]}</h3><p class="muted" style="margin-bottom:22px">${lv[1]}</p><a href="#trial" class="btn btn--primary">Обсудить на бесплатном уроке</a><br><button class="muted" id="qAgain" style="margin-top:14px;text-decoration:underline;font-size:14px">Пройти ещё раз</button></div>`;
    $('#qAgain').onclick = () => { qi = 0; score = 0; renderQ(); };
  }
  box.addEventListener('click', (e) => {
    const b = e.target.closest('.q-opt'); if (!b || box.dataset.lock) return;
    const ok = +b.dataset.i === Q[qi].r; if (ok) score++;
    b.classList.add(ok ? 'right' : 'wrong'); if (!ok) $$('.q-opt', box)[Q[qi].r].classList.add('right');
    box.dataset.lock = 1; setTimeout(() => { delete box.dataset.lock; qi++; renderQ(); }, 750);
  });
  renderQ();

  /* ---------- Анимация графика ---------- */
  const bars = $('#bars');
  new IntersectionObserver((e, o) => { if (e[0].isIntersecting) { bars.classList.add('in'); o.disconnect(); } }, { threshold: .4 }).observe(bars);

  /* ---------- КАЛЬКУЛЯТОР ---------- */
  const st = { fmt: 'online', dur: '60', pack: '8' };
  const disc = { 1: 0, 8: 0.05, 16: 0.10 };
  $$('.seg').forEach((seg) => seg.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', seg).forEach((x) => x.classList.toggle('on', x === b)); st[seg.dataset.k] = b.dataset.v; calc();
  }));
  const pw = $('#perWeek'); pw.addEventListener('input', calc);
  function calc() {
    const P = C.prices || { online60: 1500, online90: 2100, home60: 2000, home90: 2800 };
    const base = P[st.fmt + st.dur], n = +pw.value, d = disc[st.pack];
    const lesson = base * (1 - d), month = lesson * n * 4.33, save = base * n * 4.33 - month;
    $('#perWeekOut').textContent = n;
    $('#sumOut').textContent = rub(month);
    $('#perLesson').textContent = `${rub(lesson)} за урок · ${n} ${n === 1 ? 'урок' : 'урока'} в неделю`;
    $('#saveOut').textContent = save > 0 ? `Экономия ${rub(save)} в месяц` : 'Без скидки';
    $('#calcField').value = `${st.fmt === 'online' ? 'онлайн' : 'очно'}, ${st.dur} мин, ${n}/нед, ≈${rub(month)}/мес`;
  }
  calc();

  /* ---------- РАСПИСАНИЕ: свободные окна (меняйте массив busy) ---------- */
  const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const times = ['10:00', '12:00', '15:00', '16:30', '18:00', '19:30'];
  // занятые окна: "день-время"
  const busy = new Set(['0-0', '0-3', '0-4', '1-1', '1-2', '1-4', '1-5', '2-0', '2-3', '2-4', '3-1', '3-3', '3-5', '4-2', '4-4', '4-5', '5-0', '5-1']);
  let html = '<table><thead><tr><th></th>' + days.map((d) => `<th>${d}</th>`).join('') + '</tr></thead><tbody>';
  times.forEach((t, ti) => {
    html += `<tr><td>${t}</td>` + days.map((d, di) => busy.has(`${di}-${ti}`) ? '<td><span class="sl busy">занято</span></td>' : `<td><button class="sl free" data-slot="${d}, ${t}">${t}</button></td>`).join('') + '</tr>';
  });
  $('#sched').innerHTML = html + '</tbody></table>';
  $('#sched').addEventListener('click', (e) => {
    const b = e.target.closest('[data-slot]'); if (!b) return;
    $('#slotField').value = b.dataset.slot;
    const n = $('#slotNote'); n.style.display = 'block'; n.textContent = '🕒 Выбранное время: ' + b.dataset.slot;
    toast('Время ' + b.dataset.slot + ' добавлено в заявку');
    $('#trial').scrollIntoView({ behavior: 'smooth' });
  });
})();
