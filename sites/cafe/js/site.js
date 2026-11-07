/* Зерно: меню из menu.js, корзина с доставкой, бонусная карта, параллакс */
(function () {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const C = window.SITE_CONFIG || {}, M = window.MENU || { categories: [], items: [] };
  const D = C.delivery || { min: 0, free: 0, price: 0 };
  const rub = (n) => n.toLocaleString('ru-RU') + ' ₽';
  const cart = {}; // index -> qty
  let cat = M.categories[0];

  /* ---------- Меню ---------- */
  $('#menuNav').innerHTML = M.categories.map((c) => `<button data-c="${c}" class="${c === cat ? 'active' : ''}">${c}</button>`).join('');
  $('#menuNav').addEventListener('click', (e) => { const b = e.target.closest('button'); if (!b) return; cat = b.dataset.c; $$('#menuNav button').forEach((x) => x.classList.toggle('active', x === b)); renderMenu(); });
  function ctrl(i) { const q = cart[i] || 0; return q ? `<span class="qty"><button data-m="${i}">−</button><span>${q}</span><button data-p="${i}">+</button></span>` : `<button class="add" data-p="${i}">+ В заказ</button>`; }
  function renderMenu() {
    $('#menuGrid').innerHTML = M.items.map((it, i) => ({ it, i })).filter((x) => x.it.cat === cat).map(({ it, i }, k) =>
      `<div class="dish" style="animation-delay:${k * 40}ms"><div><h3>${it.name}${it.tag ? `<span class="tag ${it.tag}">${it.tag}</span>` : ''}</h3><p>${it.desc}</p></div><div class="dish__r"><span class="dish__price">${rub(it.price)}</span><span data-ctrl="${i}">${ctrl(i)}</span></div></div>`).join('');
  }
  renderMenu();

  document.addEventListener('click', (e) => {
    const p = e.target.closest('[data-p]'), m = e.target.closest('[data-m]');
    if (p) { const i = +p.dataset.p; cart[i] = (cart[i] || 0) + 1; update(); if (cart[i] === 1 && !p.closest('#cartList')) toast(`«${M.items[i].name}» добавлен в заказ`); }
    if (m) { const i = +m.dataset.m; cart[i]--; if (cart[i] <= 0) delete cart[i]; update(); }
  });

  /* ---------- Корзина ---------- */
  const type = () => ($('#orderForm input[name=type]:checked') || {}).value;
  function update() {
    $$('[data-ctrl]').forEach((el) => (el.innerHTML = ctrl(+el.dataset.ctrl)));
    const keys = Object.keys(cart), count = keys.reduce((s, k) => s + cart[k], 0), sub = keys.reduce((s, k) => s + cart[k] * M.items[k].price, 0);
    const deliv = type() === 'Доставка' ? (sub >= D.free ? 0 : D.price) : 0;
    $('#cartBtn').classList.toggle('show', count > 0);
    $('#cartCount').textContent = count; $('#cartSum').textContent = rub(sub);
    $('#cartList').innerHTML = keys.length ? keys.map((k) => `<div class="ci"><div><b>${M.items[k].name}</b><small>${rub(M.items[k].price)} × ${cart[k]}</small></div><span class="qty"><button data-m="${k}">−</button><span>${cart[k]}</span><button data-p="${k}">+</button></span></div>`).join('') : '<p class="muted" style="padding:30px 0;text-align:center">Корзина пуста — добавьте что-нибудь вкусное ☕</p>';
    $('#cSub').textContent = rub(sub);
    $('#cDelRow').style.display = type() === 'Доставка' ? '' : 'none';
    $('#cDel').textContent = deliv ? rub(deliv) : `бесплатно`;
    $('#cTot').textContent = rub(sub + deliv);
    const of = $('#orderField'); if (of) of.value = keys.map((k) => `${M.items[k].name} ×${cart[k]}`).join('; ') + ` | Итого: ${rub(sub + deliv)}`;
    const btn = $('#orderForm [type=submit]');
    if (btn) { const low = type() === 'Доставка' && sub < D.min; btn.disabled = !count || low; btn.textContent = low ? `Доставка от ${rub(D.min)}` : 'Оформить заказ'; }
  }
  const open = (v) => { $('#drawer').classList.toggle('open', v); $('#overlay').classList.toggle('open', v); document.body.style.overflow = v ? 'hidden' : ''; };
  $('#cartBtn').onclick = () => open(true); $('#drawerClose').onclick = () => open(false); $('#overlay').onclick = () => open(false);
  $$('#orderForm input[name=type]').forEach((r) => r.addEventListener('change', () => { $('#addr').style.display = type() === 'Доставка' ? '' : 'none'; $('#addr').required = type() === 'Доставка'; update(); }));
  // после успешной отправки — очистить корзину
  new MutationObserver(() => { if ($('#orderForm .form-success')) { Object.keys(cart).forEach((k) => delete cart[k]); $$('[data-ctrl]').forEach((el) => (el.innerHTML = ctrl(+el.dataset.ctrl))); $('#cartBtn').classList.remove('show'); } }).observe($('#orderForm'), { childList: true });
  update();

  /* ---------- Бонусная карта ---------- */
  let st = 0; const stamps = $$('.stamp:not(.gift)');
  $('#stampCard').addEventListener('click', () => {
    st = st >= 5 ? 0 : st + 1;
    stamps.forEach((s, i) => { s.classList.toggle('on', i < st); s.textContent = i < st ? '☕' : ''; });
    $('#stampTxt').textContent = `${st} из 5`;
    if (st === 5) toast('🎁 Следующий кофе — за наш счёт!');
  });

  /* ---------- Дата брони по умолчанию — сегодня ---------- */
  const d = $('#bDate'); if (d) { const t = new Date(); d.min = d.value = t.toISOString().slice(0, 10); }

  /* ---------- Параллакс героя ---------- */
  const hi = $('#heroImg');
  addEventListener('scroll', () => { if (scrollY < innerHeight) hi.style.transform = `scale(1.1) translateY(${scrollY * 0.15}px)`; }, { passive: true });
})();
