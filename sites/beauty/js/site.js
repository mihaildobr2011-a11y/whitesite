/* Lumière — онлайн-запись в 4 шага.
   Услуги берутся из прайса (.price-row), мастера — из блока «Команда» (.master).
   Меняете прайс или мастеров в HTML — запись обновится автоматически. */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const modal = $('#booking'); if (!modal) return;
  const fmt = (n) => Number(n).toLocaleString('ru-RU') + ' ₽';
  const formTpl = $('#bk-form').outerHTML;
  const state = { step: 1, service: null, master: null, day: null, time: null };

  // Кнопка «Записаться» у каждой услуги прайса
  $$('.price-row[data-service]').forEach((row) => {
    const b = document.createElement('button'); b.textContent = 'Записаться'; b.dataset.modalOpen = 'booking'; b.dataset.pickService = row.dataset.service;
    row.querySelector('.val').after(b);
  });

  const services = $$('.price-row[data-service]').map((r) => ({ name: r.dataset.service, price: r.dataset.price, dur: r.dataset.dur, val: r.querySelector('.val').textContent }));
  const masters = [{ name: 'Любой свободный мастер', role: 'подберём лучшее время', img: '' }].concat($$('[data-master]').map((m) => ({ name: m.dataset.master, role: m.dataset.role, img: m.dataset.img })));

  const svcBox = $('#bk-services'), msBox = $('#bk-masters'), daysBox = $('#bk-days'), slotsBox = $('#bk-slots');
  svcBox.innerHTML = services.map((s, i) => `<button class="opt" data-i="${i}"><span>${s.name}<small>${s.dur}</small></span><b>${s.val}</b></button>`).join('');
  msBox.innerHTML = masters.map((m, i) => `<button class="opt" data-i="${i}"><span class="who">${m.img ? `<img src="${m.img}" alt="">` : '<span class="avatar">✦</span>'}<span>${m.name}<small>${m.role}</small></span></span></button>`).join('');

  const DOW = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const days = [...Array(7)].map((_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d; });
  daysBox.innerHTML = days.map((d, i) => `<button class="day" data-i="${i}">${i === 0 ? 'сегодня' : DOW[d.getDay()]}<b>${d.getDate()}</b></button>`).join('');

  function renderSlots() {
    if (state.day == null) { slotsBox.innerHTML = '<p class="muted" style="grid-column:1/-1">Выберите день</p>'; return; }
    const d = days[state.day], nowH = new Date().getHours();
    let html = '';
    for (let h = 10; h <= 20; h++) for (const m of [0, 30]) {
      if (h === 20 && m) continue;
      const t = `${h}:${m ? '30' : '00'}`;
      const seed = (d.getDate() * 31 + h * 7 + m + (state.master || 0) * 13) % 10; // имитация занятых слотов
      const busy = seed < 3 || (state.day === 0 && h <= nowH);
      html += `<button class="slot" ${busy ? 'disabled' : ''} data-t="${t}">${t}</button>`;
    }
    slotsBox.innerHTML = html;
  }

  function go(n) {
    state.step = n;
    $$('.bk-step', modal).forEach((s) => s.classList.toggle('active', +s.dataset.step === n));
    $$('.steps-bar i', modal).forEach((b, i) => b.classList.toggle('on', i < n));
    $('#bk-back').style.visibility = n > 1 ? 'visible' : 'hidden';
    $('#bk-next').style.display = n < 4 ? '' : 'none';
    if (n === 3) renderSlots();
    if (n === 4) {
      const s = services[state.service], m = masters[state.master], d = days[state.day];
      const when = d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', weekday: 'short' }) + ', ' + state.time;
      $('#bk-summary').innerHTML = `<div><span>Услуга</span><b>${s.name}</b></div><div><span>Мастер</span><b>${m.name}</b></div><div><span>Когда</span><b>${when}</b></div><div><span>Стоимость</span><b>${s.val}</b></div>`;
      const f = $('#bk-form'); if (f) { f.service.value = s.name; f.master.value = m.name; f.when.value = when; }
    }
    validate();
  }
  function validate() {
    const ok = { 1: state.service != null, 2: state.master != null, 3: state.day != null && !!state.time }[state.step];
    $('#bk-next').disabled = !ok;
  }
  function select(box, i) { $$('.opt,.day', box).forEach((o) => o.classList.toggle('sel', +o.dataset.i === i)); }

  svcBox.addEventListener('click', (e) => { const o = e.target.closest('.opt'); if (!o) return; state.service = +o.dataset.i; select(svcBox, state.service); validate(); setTimeout(() => go(2), 220); });
  msBox.addEventListener('click', (e) => { const o = e.target.closest('.opt'); if (!o) return; state.master = +o.dataset.i; select(msBox, state.master); validate(); setTimeout(() => go(3), 220); });
  daysBox.addEventListener('click', (e) => { const o = e.target.closest('.day'); if (!o) return; state.day = +o.dataset.i; state.time = null; select(daysBox, state.day); renderSlots(); validate(); });
  slotsBox.addEventListener('click', (e) => { const o = e.target.closest('.slot'); if (!o || o.disabled) return; state.time = o.dataset.t; $$('.slot', slotsBox).forEach((x) => x.classList.toggle('sel', x === o)); validate(); });
  $('#bk-next').onclick = () => go(state.step + 1);
  $('#bk-back').onclick = () => go(state.step - 1);

  // Открытие: сброс и предвыбор услуги/мастера
  modal.addEventListener('modal:open', (e) => {
    const src = e.detail || {};
    const old = $('#bk-form') || $('.form-success', modal)?.parentElement; // восстановить форму после успешной отправки
    const step4 = $('[data-step="4"]', modal); const cur = step4.querySelector('form'); if (cur) cur.remove(); step4.insertAdjacentHTML('beforeend', formTpl);
    bindForm();
    Object.assign(state, { service: null, master: null, day: 0, time: null });
    $$('.sel', modal).forEach((x) => x.classList.remove('sel')); select(daysBox, 0);
    const ps = src.dataset && src.dataset.pickService, pm = src.dataset && src.dataset.pickMaster;
    if (pm) { state.master = masters.findIndex((m) => m.name === pm); select(msBox, state.master); }
    if (ps) { state.service = services.findIndex((s) => s.name === ps); select(svcBox, state.service); go(pm ? 3 : 2); }
    else go(1);
  });

  // Форма шага 4 пересоздаётся — навешиваем отправку заново
  function bindForm() {
    const form = $('#bk-form');
    form.querySelectorAll('input[type="tel"]').forEach((inp) => inp.addEventListener('input', () => {
      let d = inp.value.replace(/\D/g, ''); if (!d) return; if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
      let r = '+7'; if (d.length > 1) r += ' (' + d.slice(1, 4); if (d.length >= 4) r += ') ' + d.slice(4, 7); if (d.length >= 7) r += '-' + d.slice(7, 9); if (d.length >= 9) r += '-' + d.slice(9, 11); inp.value = r;
    }));
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); e.stopImmediatePropagation(); if (!validateForm(form)) return;
      const btn = form.querySelector('[type=submit]'); btn.disabled = true; btn.textContent = 'Отправляем…';
      try {
        await sendLead(Object.assign(collectForm(form), { 'Форма': 'Онлайн-запись' }));
        form.innerHTML = `<div class="form-success"><div class="check">${ICONS.check}</div><h3>Вы записаны!</h3><p class="muted" style="margin-top:8px">${form.dataset.success}</p></div>`;
        $('#bk-summary').style.display = 'none'; $('#bk-back').style.visibility = 'hidden';
      } catch (err) { toast('Не удалось отправить, позвоните нам'); btn.disabled = false; btn.textContent = 'Подтвердить запись'; }
    });
  }
  modal.addEventListener('modal:open', () => { $('#bk-summary').style.display = ''; });
})();
