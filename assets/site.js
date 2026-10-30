/* Irad Pochtasy: language switch, dates, tracking, pension day, e-postcard. */
(function () {
  "use strict";
  var I = window.POST_I18N || { ir: {}, ru: {} };
  var LANG = "en";
  try { LANG = localStorage.getItem("post-lang") || "en"; } catch (e) {}
  if (["en", "ir", "ru"].indexOf(LANG) < 0) LANG = "en";

  var UI = {
    en: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      notFound: "No record was found. Check the number and try again.",
      copied: "Link copied.", copyFail: "Copy the address from your browser's address bar.",
      pensionDay: "Payment from {d}", gotCard: "You have a postcard from Irad.",
      dear: "To", from: "From"
    },
    ir: {
      months: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
      notFound: "Jazuu tabılgan jok. Nomerdi tekshirip, kayra araket kılıñız.",
      copied: "Shilteme köchürüldü.", copyFail: "Darekti brauzerdin darek sabınan köchürüñüz.",
      pensionDay: "Tölöm {d} bashtalat", gotCard: "Sizge Iraddan otkrıtka keldi.",
      dear: "Kimge", from: "Kimden"
    },
    ru: {
      months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      notFound: "Запись не найдена. Проверьте номер и попробуйте ещё раз.",
      copied: "Ссылка скопирована.", copyFail: "Скопируйте адрес из адресной строки браузера.",
      pensionDay: "Выплата с {d}", gotCard: "Вам открытка из Ирада.",
      dear: "Кому", from: "От кого"
    }
  };

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function fill(s, v) { return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? v[k] : m; }); }
  function u(k) { return UI[LANG][k] != null ? UI[LANG][k] : UI.en[k]; }
  function L(o, v) { var s = typeof o === "string" ? o : (o[LANG] != null ? o[LANG] : o.en); return v ? fill(s, v) : s; }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function iradNow() { var n = new Date(); return new Date(n.getTime() + n.getTimezoneOffset() * 60000 + 6 * 3600000); }
  function today() { var d = iradNow(); return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); }
  function addDays(d, n) { var x = new Date(d.getTime()); x.setUTCDate(x.getUTCDate() + n); return x; }
  function fmtD(d) { var M = u("months"); return LANG === "ir" ? d.getUTCDate() + "-" + M[d.getUTCMonth()] + " " + d.getUTCFullYear() : d.getUTCDate() + " " + M[d.getUTCMonth()] + " " + d.getUTCFullYear(); }
  function parseD(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function norm(s) { return String(s || "").toUpperCase().replace(/[\s\-\.]/g, ""); }

  /* ---------- language ---------- */
  var EN = {};
  function applyLang() {
    document.documentElement.lang = LANG === "ir" ? "ky-Latn" : LANG;
    $$("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in EN)) EN[k] = el.innerHTML;
      el.innerHTML = LANG === "en" ? EN[k] : (I[LANG][k] != null ? I[LANG][k] : EN[k]);
    });
    $$("[data-date]").forEach(function (el) { el.textContent = fmtD(parseD(el.getAttribute("data-date"))); });
    $$(".langs button").forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-lang") === LANG ? "true" : "false"); });
    var tk = document.body.getAttribute("data-title-key");
    if (tk && LANG !== "en" && I[LANG][tk] && document.body.getAttribute("data-page") !== "index") document.title = I[LANG][tk].replace(/<[^>]+>/g, "") + " · " + (LANG === "ru" ? "Ирадпочта" : "Irad Pochtası");
    else if (LANG === "en" && document.body.dataset.enTitle) document.title = document.body.dataset.enTitle;
    if (window.__postRerender) window.__postRerender();
  }
  document.body.dataset.enTitle = document.title;
  $$(".langs button").forEach(function (b) {
    b.addEventListener("click", function () {
      LANG = b.getAttribute("data-lang");
      try { localStorage.setItem("post-lang", LANG); } catch (e) {}
      applyLang();
    });
  });

  /* ---------- tracking (same results as e-Irad for the same number) ---------- */
  var PC = {
    bad: { en: "Tracking numbers look like RA123456789KZ (from abroad) or IP12345678 (inside Irad).", ir: "Izdöö nomerleri RA123456789KZ (chet elden) je IP12345678 (Iraddın ichinde) sıyaktuu bolot.", ru: "Трек-номер выглядит как RA123456789KZ (из-за рубежа) или IP12345678 (внутри Ирада)." },
    places: ["Talas Central Post Office", "Post Office No. 14, Nurzhan", "Post Office No. 3, Iyık Janyl", "Post Office, Kyzyl-Adyr", "Post Office, Tash-Kömür", "Post Office, Bazar-Korgon", "Post Office, Toktogul", "Post Office No. 22, Talas (Semiz)"],
    placesRu: ["Таласский центральный почтамт", "Отделение № 14, Нуржан", "Отделение № 3, Ийык-Джаныл", "Отделение связи, Кызыл-Адыр", "Отделение связи, Таш-Кумыр", "Отделение связи, Базар-Коргон", "Отделение связи, Токтогул", "Отделение № 22, Талас (Семиз)"],
    placesIr: ["Talas borborduk pochtası", "14-pochta bölümü, Nurzhan", "3-pochta bölümü, Iyık Janıl", "Pochta bölümü, Kızıl-Adır", "Pochta bölümü, Tash-Kömür", "Pochta bölümü, Bazar-Korgon", "Pochta bölümü, Toktogul", "22-pochta bölümü, Talas (Semiz)"],
    ev: {
      acc: { en: "Accepted at {p}", ir: "{p} kabıl aldı", ru: "Принято: {p}" },
      sort: { en: "Sorted, Talas sorting centre", ir: "Talas sortirovka borborunda sortirovkalandı", ru: "Обработано, Таласский сортировочный центр" },
      disp: { en: "Dispatched to {p}", ir: "{p} karay jönötüldü", ru: "Отправлено в {p}" },
      arr: { en: "Arrived at {p}", ir: "{p} keldi", ru: "Прибыло: {p}" },
      wait: { en: "Awaiting collection at {p}. Bring your ID card and the notice (form P-22); items are kept for 30 days.", ir: "{p} aluuga dayar. Jeke kuböölügüñüzdü jana bildirüünü (P-22 forması) ala keliñiz; jönötmölör 30 kün saktalat.", ru: "Ожидает получения: {p}. Возьмите удостоверение личности и извещение (бланк P-22); отправления хранятся 30 дней." },
      deliv: { en: "Delivered", ir: "Tapshırıldı", ru: "Вручено" },
      abroad: { en: "Accepted for posting abroad ({c})", ir: "Chet elde jönötüügö kabıl alındı ({c})", ru: "Принято к пересылке за рубежом ({c})" },
      almaty: { en: "Received by the Kazakh postal service, Almaty international exchange", ir: "Kazakstan pochta kızmatı aldı, Almatı el aralık almashuu punktu", ru: "Получено казахстанской почтой, Алматинский международный пункт обмена" },
      handed: { en: "Handed over to Irad Pochtasy at the Chu Gate exchange", ir: "Chüy darbazasındagı almashuu punktunda Irad Pochtasına berildi", ru: "Передано «Ирадпочте» в пункте обмена Чуйские ворота" },
      customs: { en: "Customs inspection, Talas Customs Clearance Terminal", ir: "Bajı tekshirüüsü, Talas bajı tarıktoo terminalı", ru: "Таможенный досмотр, Таласский таможенный терминал" },
      held: { en: "Held by customs: a declaration is required. Bring the invoice and your ID card to the terminal's postal counter.", ir: "Bajı karmadı: deklaratsiya kerek. Esep-faktura jana jeke kuböölügüñüz menen terminaldın pochta kassasına keliñiz.", ru: "Задержано таможней: требуется декларация. Принесите счёт и удостоверение личности в почтовое окно терминала." },
      released: { en: "Released by customs", ir: "Bajıdan chıgarıldı", ru: "Выпущено таможней" }
    },
    intl: { en: "International items reach Irad through the Kazakh postal service, by way of Almaty. Allow three to six weeks.", ir: "Chet eldik jönötmölör Iradga Kazakstan pochtası arkıluu, Almatı arkıluu kelet. Üch-altı juma kütüñüz.", ru: "Международные отправления приходят в Ирад через казахстанскую почту, через Алматы. Срок три-шесть недель." }
  };
  function place(i) { return (LANG === "ru" ? PC.placesRu : LANG === "ir" ? PC.placesIr : PC.places)[i % PC.places.length]; }
  function trackHtml(n) {
    var intl = /^[A-Z]{2}\d{9}[A-Z]{2}$/.test(n), dom = /^IP\d{8,10}$/.test(n);
    if (!intl && !dom) return '<div class="note">' + esc(L(PC.bad)) + "</div>";
    var h = hash(n);
    if (h % 9 === 0) return '<div class="note">' + esc(u("notFound")) + "</div>";
    var dest = (h >>> 3) % PC.places.length, ev = [], day = 0, stage = h % 4, E = PC.ev;
    function push(o, v) { ev.push([day, L(o, v)]); day += 1 + ((h >>> (ev.length + 2)) % 3); }
    if (intl) {
      push(E.abroad, { c: n.slice(-2) }); day += 6; push(E.almaty); day += 4; push(E.handed); push(E.customs);
      if (stage === 0) push(E.held);
      else { push(E.released); push(E.disp, { p: place(dest) }); if (stage >= 2) push(E.arr, { p: place(dest) }); if (stage === 2) push(E.wait, { p: place(dest) }); if (stage === 3) push(E.deliv); }
    } else {
      var org = (h >>> 7) % PC.places.length; if (org === dest) org = (org + 1) % PC.places.length;
      push(E.acc, { p: place(org) }); push(E.sort); push(E.disp, { p: place(dest) });
      if (stage >= 1) push(E.arr, { p: place(dest) });
      if (stage === 1 || stage === 2) push(E.wait, { p: place(dest) });
      if (stage === 3) push(E.deliv);
    }
    var total = ev[ev.length - 1][0], start = addDays(today(), -total - (h % 2));
    var rev = ev.slice().reverse();
    return '<div class="card" style="margin-top:16px"><h2 style="margin-top:0">' + esc(n) + '</h2><p class="status">' + esc(rev[0][1]) + '</p><ol class="timeline">' +
      rev.map(function (x, i) { return '<li class="' + (i === 0 ? "now" : "") + '"><span class="when">' + esc(fmtD(addDays(start, x[0]))) + "</span>" + esc(x[1]) + "</li>"; }).join("") +
      "</ol>" + (intl ? '<p class="muted small">' + esc(L(PC.intl)) + "</p>" : "") + "</div>";
  }
  var trackNo = "";
  var out = $("#track-result");
  $$("[data-track-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      var v = norm($("input", f).value);
      if (!out) { e.preventDefault(); location.href = "track.html#" + encodeURIComponent(v); return; }
      e.preventDefault();
      trackNo = v;
      try { history.replaceState(null, "", "#" + encodeURIComponent(v)); } catch (x) {}
      out.innerHTML = trackHtml(v);
    });
  });
  if (out) {
    var q = location.hash.slice(1) || (location.search.match(/[?&]n=([^&]+)/) || [])[1] || "";
    if (q) { trackNo = norm(decodeURIComponent(q)); $("#tn").value = trackNo; out.innerHTML = trackHtml(trackNo); }
  }

  /* ---------- pension day ---------- */
  var pd = $("#pension-day");
  function pensionDay() {
    var t = today(), d = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth(), 10));
    if (t.getUTCDate() > 15) d = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 10));
    if (d.getUTCDay() === 0) d = addDays(d, 1);
    pd.textContent = fill(u("pensionDay"), { d: fmtD(d) });
  }

  /* ---------- e-postcard ---------- */
  var form = $("#pc-form"), card = null;
  function b64e(o) { var s = unescape(encodeURIComponent(JSON.stringify(o))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function b64d(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function stampOk(id) { return /^[0-9]{4}-[a-z]+-[0-9]+$/.test(id) && !!$('.pc-stamps input[value="' + id + '"]'); }
  function pic(id) { return /^[a-z-]+$/.test(id || "") ? $('.pc-pics input[value="' + id + '"]') : null; }
  function render(c) {
    var pv = pic(c.v) || $('.pc-pics input');
    if (pv) {
      $("#pc-fimg").src = "img/cards/" + pv.value + ".webp";
      $("#pc-fimg").alt = pv.getAttribute("data-" + LANG) || pv.getAttribute("data-en");
      $("#pc-fplace").textContent = pv.getAttribute("data-place");
      $("#pc-cap").textContent = (pv.getAttribute("data-" + LANG) || pv.getAttribute("data-en")) + " · IRAD POCHTASY";
    }
    $("#pc-vmsg").textContent = c.m || "";
    $("#pc-vto").textContent = c.t ? u("dear") + ": " + c.t : "";
    $("#pc-vfrom").textContent = c.f ? u("from") + ": " + c.f : "";
    if (stampOk(c.s)) $("#pc-stp").src = "img/stamps/" + c.s + ".webp";
    var d = c.d ? parseD(c.d) : today();
    $("#pc-pm").innerHTML = esc(c.p || "TALAS") + "<br>" + pad(d.getUTCDate()) + "·" + pad(d.getUTCMonth() + 1) + "·" + String(d.getUTCFullYear()).slice(2) + "<br>IRAD POCHTASY";
  }
  function current() {
    var st = $('.pc-stamps input:checked'), pv = $('.pc-pics input:checked');
    var t = today();
    return { t: $("#pc-to").value.slice(0, 40), m: $("#pc-msg").value.slice(0, 280), f: $("#pc-from").value.slice(0, 40), p: $("#pc-place").value, s: st ? st.value : "2026-horse-8", v: pv ? pv.value : "", d: t.getUTCFullYear() + "-" + pad(t.getUTCMonth() + 1) + "-" + pad(t.getUTCDate()) };
  }
  if (form) {
    var m = location.hash.match(/^#c=([A-Za-z0-9_-]+)$/);
    if (m) {
      try { card = b64d(m[1]); } catch (e) { card = null; }
    }
    if (card && typeof card === "object") {
      form.hidden = true;
      $("#pc-intro").textContent = u("gotCard");
      $("#pc-intro").removeAttribute("data-i18n");
      $("#pc-reply").hidden = false;
      render(card);
    } else {
      ["#pc-to", "#pc-msg", "#pc-from", "#pc-place"].forEach(function (s) { $(s).addEventListener("input", function () { render(current()); }); });
      $$('.pc-stamps input, .pc-pics input').forEach(function (r) { r.addEventListener("change", function () { render(current()); }); });
      render(current());
      $("#pc-copy").addEventListener("click", function () {
        var url = location.href.split("#")[0] + "#c=" + b64e(current());
        try { history.replaceState(null, "", url); } catch (e) {}
        var done = function () { $("#pc-copied").textContent = u("copied"); }, fail = function () { $("#pc-copied").textContent = u("copyFail"); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fail); else fail();
      });
    }
  }

  window.__postRerender = function () {
    if (out && trackNo) out.innerHTML = trackHtml(trackNo);
    if (pd) pensionDay();
    if (form) { render(card || current()); if (card) $("#pc-intro").textContent = u("gotCard"); }
  };
  applyLang();
})();

/* holiday, half-mast, pass and power notices shared by the state sites (iradgov.org/assets/irad-bar.js) */
(function () {
  var s = document.createElement("script");
  s.src = "https://iradgov.org/assets/irad-bar.js"; s.defer = true; s.setAttribute("data-kind", "post");
  document.head.appendChild(s);
})();
