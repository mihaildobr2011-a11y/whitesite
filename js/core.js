/* =========================================================
   CORE.JS — общий движок сайтов WhiteSite
   Ничего здесь менять не нужно: всё настраивается в config.js
   ========================================================= */
(function () {
  'use strict';
  const C = window.SITE_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const digits = (s) => String(s || '').replace(/\D/g, '');

  /* ---------- Иконки ---------- */
  const ICONS = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>',
    telegram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.2-8.3c.4-.4-.1-.6-.6-.2L6 13.6l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.5 3c.9-.3 1.7.2 1.4 1.3z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.8 14.1c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.6 2.1 1.1 1 2.1 1.3 2.4 1.4.3.2.5.1.6 0l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.3z"/></svg>',
    vk: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 19c-7 0-11-4.8-11.2-12.8h3.5c.1 5.9 2.7 8.4 4.8 8.9V6.2h3.3v5.1c2-.2 4.2-2.5 4.9-5.1h3.3a9.8 9.8 0 0 1-4.5 6.4 10.2 10.2 0 0 1 5.3 6.4h-3.6a6.4 6.4 0 0 0-5.4-4.6V19z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>'
  };
  window.ICONS = ICONS;

  /* ---------- Подстановка контактов из config.js ----------
     <a data-cfg="phone"></a> → номер + ссылка tel:
     Поддерживается: phone, email, address, telegram, whatsapp, vk, name, hoursText, legalOwner, inn */
  function links() {
    return {
      phone: C.phone && 'tel:+' + digits(C.phone),
      email: C.email && 'mailto:' + C.email,
      telegram: C.telegram && 'https://t.me/' + C.telegram.replace('@', ''),
      whatsapp: C.whatsapp && 'https://wa.me/' + digits(C.whatsapp),
      vk: C.vk && 'https://vk.com/' + C.vk
    };
  }
  function fillConfig() {
    const L = links();
    const text = {
      phone: C.phone, email: C.email, address: C.address, name: C.name,
      telegram: C.telegram, whatsapp: C.whatsapp, vk: C.vk && 'vk.com/' + C.vk,
      hoursText: C.hoursText, legalOwner: C.legal && C.legal.owner, inn: C.legal && C.legal.inn
    };
    $$('[data-cfg]').forEach((el) => {
      const k = el.dataset.cfg;
      if (!text[k]) { if (el.dataset.hideEmpty !== undefined) el.style.display = 'none'; return; }
      if (el.dataset.keep === undefined) el.textContent = text[k];
      if (el.tagName === 'A' && L[k]) { el.href = L[k]; if (k !== 'phone' && k !== 'email') { el.target = '_blank'; el.rel = 'noopener'; } }
    });
    $$('[data-cfg-href]').forEach((el) => { const k = el.dataset.cfgHref; if (L[k]) { el.href = L[k]; if (k !== 'phone' && k !== 'email') { el.target = '_blank'; el.rel = 'noopener'; } } else el.style.display = 'none'; });
    $$('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
    // Карта Яндекса
    $$('[data-map]').forEach((el) => {
      if (!C.map) return;
      const { lat, lon, zoom = 16 } = C.map;
      el.innerHTML = `<iframe loading="lazy" title="Карта" src="https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=${zoom}&pt=${lon}%2C${lat}%2Cpm2rdl"></iframe>`;
    });
  }

  /* ---------- Шапка и меню ---------- */
  function header() {
    const h = $('.header'); const burger = $('.burger'); const nav = $('.nav');
    if (h) { const on = () => h.classList.toggle('scrolled', scrollY > 30); on(); addEventListener('scroll', on, { passive: true }); }
    if (burger && nav) {
      burger.addEventListener('click', () => { burger.classList.toggle('open'); nav.classList.toggle('open'); document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : ''; });
      $$('a', nav).forEach((a) => a.addEventListener('click', () => { burger.classList.remove('open'); nav.classList.remove('open'); document.body.style.overflow = ''; }));
    }
  }

  /* ---------- Появление при прокрутке ---------- */
  function reveal() {
    const els = $$('[data-reveal]');
    if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'));
    const io = new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((e, i) => { if (e.dataset.delay) e.style.transitionDelay = e.dataset.delay + 'ms'; io.observe(e); });
  }

  /* ---------- Счётчики ---------- */
  function counters() {
    const io = new IntersectionObserver((ents) => ents.forEach((e) => {
      if (!e.isIntersecting) return; io.unobserve(e.target);
      const el = e.target, to = parseFloat(el.dataset.count), dur = 1600, t0 = performance.now(), dec = (el.dataset.count.split('.')[1] || '').length;
      const step = (t) => { const p = Math.min((t - t0) / dur, 1), v = to * (1 - Math.pow(1 - p, 3)); el.textContent = v.toLocaleString('ru-RU', { minimumFractionDigits: dec, maximumFractionDigits: dec }); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }), { threshold: 0.5 });
    $$('[data-count]').forEach((el) => io.observe(el));
  }

  /* ---------- Аккордеон ---------- */
  function accordion() {
    $$('.acc-btn').forEach((b) => b.addEventListener('click', () => {
      const item = b.closest('.acc-item'); const group = item.parentElement;
      const was = item.classList.contains('open');
      $$('.acc-item', group).forEach((i) => i.classList.remove('open'));
      if (!was) item.classList.add('open');
    }));
  }

  /* ---------- Табы ---------- */
  function tabs() {
    $$('[data-tabs]').forEach((wrap) => {
      const btns = $$('[data-tab]', wrap), panels = $$('[data-panel]', wrap);
      btns.forEach((b) => b.addEventListener('click', () => {
        btns.forEach((x) => x.classList.toggle('active', x === b));
        panels.forEach((p) => p.classList.toggle('active', p.dataset.panel === b.dataset.tab));
      }));
    });
  }

  /* ---------- Карусель ---------- */
  function sliders() {
    $$('.slider').forEach((s) => {
      const tr = $('.slider__track', s); if (!tr) return;
      const by = (d) => tr.scrollBy({ left: d * (tr.firstElementChild.offsetWidth + 24), behavior: 'smooth' });
      const p = $('[data-prev]', s), n = $('[data-next]', s);
      p && p.addEventListener('click', () => by(-1)); n && n.addEventListener('click', () => by(1));
    });
  }

  /* ---------- До/После ---------- */
  function beforeAfter() {
    $$('.ba').forEach((ba) => { const r = $('input', ba); if (r) r.addEventListener('input', () => ba.style.setProperty('--pos', r.value + '%')); });
  }

  /* ---------- Лайтбокс ---------- */
  function lightbox() {
    const imgs = $$('[data-lightbox]'); if (!imgs.length) return;
    const lb = document.createElement('div'); lb.className = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Закрыть">×</button><button class="lb-prev" aria-label="Назад">‹</button><img alt=""><button class="lb-next" aria-label="Вперёд">›</button>';
    document.body.appendChild(lb);
    let list = [], i = 0; const im = $('img', lb);
    const show = () => { im.src = list[i].dataset.full || list[i].currentSrc || list[i].src; im.alt = list[i].alt; };
    const close = () => lb.classList.remove('open');
    imgs.forEach((el) => el.addEventListener('click', () => {
      list = imgs.filter((x) => x.dataset.lightbox === el.dataset.lightbox && x.offsetParent !== null); i = list.indexOf(el); show(); lb.classList.add('open');
    }));
    $('.lb-close', lb).onclick = close;
    $('.lb-prev', lb).onclick = () => { i = (i - 1 + list.length) % list.length; show(); };
    $('.lb-next', lb).onclick = () => { i = (i + 1) % list.length; show(); };
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    addEventListener('keydown', (e) => { if (!lb.classList.contains('open')) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') $('.lb-prev', lb).click(); if (e.key === 'ArrowRight') $('.lb-next', lb).click(); });
  }

  /* ---------- Модальные окна ---------- */
  function modals() {
    const open = (id, src) => { const m = document.getElementById(id); if (!m) return; m.classList.add('open'); document.body.style.overflow = 'hidden'; m.dispatchEvent(new CustomEvent('modal:open', { detail: src })); };
    const close = (m) => { m.classList.remove('open'); document.body.style.overflow = ''; };
    window.openModal = open;
    document.addEventListener('click', (e) => {
      const o = e.target.closest('[data-modal-open]'); if (o) { e.preventDefault(); open(o.dataset.modalOpen, o); }
      const c = e.target.closest('[data-modal-close]'); if (c) close(c.closest('.modal'));
      if (e.target.classList.contains('modal')) close(e.target);
    });
    addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.modal.open').forEach(close); });
  }

  /* ---------- Тост ---------- */
  let toastT;
  window.toast = function (msg) {
    let t = $('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 3200);
  };

  /* ---------- Маска телефона +7 ---------- */
  function phoneMask() {
    $$('input[type="tel"]').forEach((inp) => {
      const fmt = () => {
        let d = digits(inp.value); if (!d) { inp.value = ''; return; }
        if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
        let r = '+7'; if (d.length > 1) r += ' (' + d.slice(1, 4); if (d.length >= 4) r += ') ' + d.slice(4, 7); if (d.length >= 7) r += '-' + d.slice(7, 9); if (d.length >= 9) r += '-' + d.slice(9, 11);
        inp.value = r;
      };
      inp.addEventListener('input', fmt); inp.addEventListener('focus', () => { if (!inp.value) inp.value = '+7 '; });
    });
  }

  /* =========================================================
     ОТПРАВКА ЗАЯВОК
     Режим задаётся в config.js → forms.mode:
       'demo'      — ничего не отправляет, показывает «успех» (для портфолио)
       'telegram'  — в Telegram через Netlify-функцию (токен скрыт на сервере)
       'email'     — на почту через Web3Forms (нужен accessKey)
       'whatsapp'  — открывает WhatsApp с готовым текстом заявки
       'tg-direct' — открывает чат Telegram владельца с текстом (без бота)
     ========================================================= */
  async function sendLead(data) {
    const F = C.forms || { mode: 'demo' };
    const lines = Object.entries(data).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`);
    const text = `Заявка с сайта «${C.name || location.hostname}»\n` + lines.join('\n');
    switch (F.mode) {
      case 'telegram': {
        const r = await fetch(F.endpoint || '/.netlify/functions/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
        if (!r.ok) throw new Error('send failed'); return;
      }
      case 'email': {
        const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ access_key: F.web3formsKey, subject: 'Новая заявка с сайта ' + (C.name || ''), from_name: C.name, message: text, ...data }) });
        const j = await r.json(); if (!j.success) throw new Error('send failed'); return;
      }
      case 'whatsapp': window.open('https://wa.me/' + digits(C.whatsapp) + '?text=' + encodeURIComponent(text), '_blank'); return;
      case 'tg-direct': window.open('https://t.me/' + String(C.telegram).replace('@', '') + '?text=' + encodeURIComponent(text), '_blank'); return;
      default: await new Promise((r) => setTimeout(r, 700)); console.info('[DEMO] Заявка не отправлена (режим demo):\n' + text);
    }
  }
  window.sendLead = sendLead;

  function collect(form) {
    const out = {};
    $$('[name]', form).forEach((el) => {
      if (el.type === 'checkbox' && el.name === 'consent') return;
      if ((el.type === 'checkbox' || el.type === 'radio') && !el.checked) return;
      const label = el.dataset.label || el.name;
      out[label] = out[label] ? out[label] + ', ' + el.value : el.value;
    });
    return out;
  }
  window.collectForm = collect;

  function validate(form) {
    let ok = true;
    $$('[required]', form).forEach((el) => {
      let bad = el.type === 'checkbox' ? !el.checked : !el.value.trim();
      if (el.type === 'tel' && digits(el.value).length < 11) bad = true;
      el.classList.toggle('invalid', bad); if (bad) ok = false;
    });
    if (!ok) toast('Пожалуйста, заполните отмеченные поля');
    return ok;
  }
  window.validateForm = validate;

  function forms() {
    $$('form[data-lead]').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault(); if (!validate(form)) return;
        const btn = $('[type="submit"]', form), old = btn && btn.innerHTML;
        if (btn) { btn.disabled = true; btn.innerHTML = 'Отправляем…'; }
        const data = collect(form); if (form.dataset.lead) data['Форма'] = form.dataset.lead;
        try {
          await sendLead(data);
          if (window.ym && C.metrikaId) ym(C.metrikaId, 'reachGoal', 'lead');
          const msg = form.dataset.success || 'Спасибо! Мы свяжемся с вами в ближайшее время.';
          form.innerHTML = `<div class="form-success"><div class="check">${ICONS.check}</div><h3>Заявка отправлена</h3><p class="muted" style="margin-top:8px">${msg}</p></div>`;
        } catch (err) {
          toast('Не удалось отправить. Позвоните нам: ' + (C.phone || ''));
          if (btn) { btn.disabled = false; btn.innerHTML = old; }
        }
      });
      $$('.input', form).forEach((i) => i.addEventListener('input', () => i.classList.remove('invalid')));
    });
  }

  /* ---------- Плавающая кнопка связи ---------- */
  function fab() {
    if (C.fab === false) return;
    const L = links(); const items = [];
    if (L.whatsapp) items.push(`<a href="${L.whatsapp}" target="_blank" rel="noopener"><i style="background:#25d366">${ICONS.whatsapp}</i>WhatsApp</a>`);
    if (L.telegram) items.push(`<a href="${L.telegram}" target="_blank" rel="noopener"><i style="background:#229ed9">${ICONS.telegram}</i>Telegram</a>`);
    if (L.phone) items.push(`<a href="${L.phone}"><i style="background:#111">${ICONS.phone}</i>Позвонить</a>`);
    if (!items.length) return;
    const f = document.createElement('div'); f.className = 'fab';
    f.innerHTML = `<button class="fab__main" aria-label="Связаться">${ICONS.chat}</button><div class="fab__list">${items.join('')}</div>`;
    document.body.appendChild(f); $('.fab__main', f).onclick = () => f.classList.toggle('open');
  }

  /* ---------- Режим работы: «Открыто сейчас» ---------- */
  function openStatus() {
    const els = $$('[data-open-status]'); if (!els.length || !C.hours) return;
    const now = new Date(), day = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
    const today = C.hours[day]; // 0 = вс, 1 = пн …
    const open = today && h >= today[0] && h < today[1];
    const fmt = (x) => { const hh = Math.floor(x), mm = Math.round((x - hh) * 60); return hh + ':' + String(mm).padStart(2, '0'); };
    els.forEach((el) => {
      el.classList.add(open ? 'is-open' : 'is-closed');
      el.textContent = open ? `Открыто до ${fmt(today[1])}` : 'Сейчас закрыто' + (today && h < today[0] ? ` · откроемся в ${fmt(today[0])}` : '');
    });
  }

  /* ---------- Cookie-баннер ---------- */
  function cookie() {
    if (C.cookieBanner === false) return;
    try { if (localStorage.getItem('cookie-ok')) return; } catch (e) {}
    const c = document.createElement('div'); c.className = 'cookie show';
    c.innerHTML = '<p>Мы используем cookie, чтобы сайт работал лучше. Продолжая пользоваться сайтом, вы соглашаетесь с <a href="policy.html" style="text-decoration:underline">политикой конфиденциальности</a>.</p><button class="btn btn--primary">Хорошо</button>';
    document.body.appendChild(c);
    $('button', c).onclick = () => { try { localStorage.setItem('cookie-ok', 1); } catch (e) {} c.remove(); };
  }

  /* ---------- Яндекс.Метрика ---------- */
  function metrika() {
    if (!C.metrikaId) return;
    (function (m, e, t, r, i, k, a) { m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); }; m[i].l = 1 * new Date(); k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a); })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    ym(C.metrikaId, 'init', { clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true });
  }

  document.addEventListener('DOMContentLoaded', () => {
    fillConfig(); header(); reveal(); counters(); accordion(); tabs(); sliders(); beforeAfter(); lightbox(); modals(); phoneMask(); forms(); fab(); openStatus(); cookie(); metrika();
  });
})();
