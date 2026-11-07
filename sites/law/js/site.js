/* Белов и партнёры: анкета в 3 шага и онлайн-чат, который превращает переписку в заявку */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- Анкета ---------- */
  const ans = {};
  const PRICE = { 'Арбитраж / долги': 'от 60 000 ₽', 'Развод и семья': 'от 40 000 ₽', 'Уголовное дело': 'от 100 000 ₽', 'Банкротство': 'от 90 000 ₽', 'Недвижимость': 'от 35 000 ₽', 'Другое': 'после консультации' };
  function go(n) {
    $$('.ws').forEach((w) => w.classList.toggle('active', +w.dataset.ws === n));
    $$('.wiz__steps div').forEach((d) => d.classList.toggle('on', +d.dataset.s <= n));
    if (n === 3) {
      const f = $('#wizForm'); if (f && f.area) { f.area.value = ans.area; f.urg.value = ans.urg; }
      $('#estimate').innerHTML = `<b>${ans.area}</b> · ${ans.urg.toLowerCase()}<br><span class="muted">Ориентировочная стоимость ведения дела: <b style="color:var(--text)">${PRICE[ans.area]}</b>. Консультация — бесплатно.</span>`;
    }
  }
  $$('.choice').forEach((c) => c.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('button', c).forEach((x) => x.classList.toggle('sel', x === b)); ans[c.dataset.k] = b.textContent;
    setTimeout(() => go(c.dataset.k === 'area' ? 2 : 3), 200);
  }));
  $$('[data-back]').forEach((b) => b.addEventListener('click', () => go(+b.closest('.ws').dataset.ws - 1)));

  /* ---------- Онлайн-чат ---------- */
  const chat = $('#chat'), body = $('#chatBody'), inp = $('#chatIn');
  const S = { step: 0, q: '', name: '' };
  const add = (t, who = 'bot') => { const m = document.createElement('div'); m.className = 'msg ' + who; m.innerHTML = t; body.appendChild(m); body.scrollTop = body.scrollHeight; return m; };
  const bot = (t, d = 800) => new Promise((r) => { const ty = add('<span class="typing"><i></i><i></i><i></i></span>'); setTimeout(() => { ty.innerHTML = t; body.scrollTop = body.scrollHeight; r(); }, d); });
  async function start() {
    if (S.started) return; S.started = true;
    await bot('Здравствуйте! 👋 Я юрист бюро «Белов и партнёры».', 600);
    await bot('Опишите коротко вашу ситуацию — я подскажу, как действовать.<div class="quick" style="margin-top:8px"><button>Взыскать долг</button><button>Развод</button><button>Нужен адвокат срочно</button></div>', 900);
  }
  async function handle(text) {
    add(text.replace(/</g, '&lt;'), 'me');
    if (S.step === 0) { S.q = text; S.step = 1; await bot('Понял вас. Такие вопросы мы решаем регулярно. Как к вам обращаться?'); }
    else if (S.step === 1) { S.name = text; S.step = 2; await bot(`${S.name}, оставьте номер телефона — адвокат перезвонит в течение 15 минут и бесплатно разберёт ситуацию.`); inp.type = 'tel'; inp.placeholder = '+7 (___) ___-__-__'; }
    else if (S.step === 2) {
      if (text.replace(/\D/g, '').length < 10) return bot('Кажется, номер неполный. Проверьте, пожалуйста 🙂', 500);
      S.step = 3; inp.disabled = true; inp.placeholder = 'Заявка отправлена';
      try { await sendLead({ 'Форма': 'Онлайн-чат', 'Имя': S.name, 'Телефон': text, 'Вопрос': S.q }); await bot('Спасибо! ✅ Заявка у адвоката. Перезвоним в ближайшее время.'); }
      catch (e) { await bot('Не удалось отправить. Позвоните нам: ' + (window.SITE_CONFIG.phone || '')); }
    }
  }
  body.addEventListener('click', (e) => { const b = e.target.closest('.quick button'); if (b && S.step === 0) { b.parentElement.remove(); handle(b.textContent); } });
  $('#chatForm').addEventListener('submit', (e) => { e.preventDefault(); const t = inp.value.trim(); if (!t || S.step > 2) return; inp.value = ''; handle(t); });
  const toggle = (v) => { chat.classList.toggle('open', v); if (v) { start(); setTimeout(() => inp.focus(), 300); } };
  $('#chatFab').onclick = () => toggle(!chat.classList.contains('open'));
  $('#chatClose').onclick = () => toggle(false);
  // Автоприглашение через 25 секунд
  if (!window.__video) setTimeout(() => { if (!S.started && !chat.classList.contains('open')) toggle(true); }, 25000);
})();
