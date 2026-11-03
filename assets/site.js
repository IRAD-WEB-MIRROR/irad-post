/* Irad Pochtasy: language switch, dates, tracking, pension day, postcards. */
(function () {
  "use strict";
  var I = window.POST_I18N || { ir: {}, ru: {} };
  /* text of the leadership, contacts, news, documents, vacancies and FAQ pages */
  var S = window.SITE_I18N;
  if (S) ["ir", "ru"].forEach(function (l) {
    I[l] = I[l] || {};
    ["ui", "pages"].forEach(function (s) { var m = S[s] && S[s][l]; if (m) for (var k in m) if (s === "pages" || !(k in I[l])) I[l][k] = m[k]; });
  });
  var LANG = "en";
  try { LANG = localStorage.getItem("post-lang") || "en"; } catch (e) {}
  if (["en", "ir", "ru"].indexOf(LANG) < 0) LANG = "en";

  var UI = {
    en: {
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      notFound: "No record was found. Check the number and try again.",
      copied: "Link copied.", copyFail: "Copy the address from your browser's address bar.",
      pensionDay: "Payment from {d}", gotCard: "You have a postcard from Irad.",
      dear: "To", from: "From", saveFail: "The picture could not be made in this browser.",
      serPost: "{s}, {n}", serPalace: "{s}, No. {n} · Irad Pochtasy and the Irad Palace of Art, 2026",
      ser_views: "IRAD POCHTASY · Views of Irad", ser_greetings: "IRAD POCHTASY · Greetings", ser_stamps: "IRAD POCHTASY · Stamps of Irad", ser_palace: "Palace of Art series"
    },
    ir: {
      months: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"],
      notFound: "Jazuu tabılgan jok. Nomerdi tekshirip, kayra araket kılıñız.",
      copied: "Shilteme köchürüldü.", copyFail: "Darekti brauzerdin darek sabınan köchürüñüz.",
      pensionDay: "Tölöm {d} bashtalat", gotCard: "Sizge Iraddan otkrıtka keldi.",
      dear: "Kimge", from: "Kimden", saveFail: "Bul brauzerde süröttü jasoo mümkün bolgon jok.",
      serPost: "{s}, {n}", serPalace: "{s}, {n} · Irad Pochtası jana Irad Körköm Saraiy, 2026",
      ser_views: "IRAD POCHTASY · Irad körünüshtörü", ser_greetings: "IRAD POCHTASY · Kuttuktoolor", ser_stamps: "IRAD POCHTASY · Irad markaları", ser_palace: "Körköm saraydın seriyası"
    },
    ru: {
      months: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
      notFound: "Запись не найдена. Проверьте номер и попробуйте ещё раз.",
      copied: "Ссылка скопирована.", copyFail: "Скопируйте адрес из адресной строки браузера.",
      pensionDay: "Выплата с {d}", gotCard: "Вам открытка из Ирада.",
      dear: "Кому", from: "От кого", saveFail: "В этом браузере не удалось сделать картинку.",
      serPost: "{s}, {n}", serPalace: "{s}, № {n} · Ирадпочта и Ирадский дворец искусств, 2026",
      ser_views: "IRAD POCHTASY · Виды Ирада", ser_greetings: "IRAD POCHTASY · Поздравительные", ser_stamps: "IRAD POCHTASY · Марки Ирада", ser_palace: "Серия «Дворец искусств»"
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
    var tk = document.body.getAttribute("data-title-key") || (document.body.getAttribute("data-title") ? "title_" + document.body.getAttribute("data-title") : "");
    if (tk && LANG !== "en" && I[LANG][tk] && document.body.getAttribute("data-page") !== "index") document.title = I[LANG][tk].replace(/<[^>]+>/g, "") + " · " + (LANG === "ru" ? "Ирадпочта" : "Irad Pochtası");
    else if (LANG === "en" && document.body.dataset.enTitle) document.title = document.body.dataset.enTitle;
    if (window.__postRerender) window.__postRerender();
  }
  document.body.dataset.enTitle = document.title;
  (function () {   /* menu item for the leadership, contacts, news, documents, vacancies and FAQ pages */
    var pg = document.body.getAttribute("data-page"), sec = { news: "history.html", leadership: "history.html", contacts: "history.html", documents: "history.html", vacancies: "history.html", faq: "history.html" }[pg];
    if (!sec || $("nav.main a.on")) return;
    $$("nav.main a").forEach(function (a) { if (a.getAttribute("href").replace(/^\//, "") === sec) { a.className = "on"; } });
  })();
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

  /* ---------- postcards ---------- */
  var form = $("#pc-form"), card = null;
  function b64e(o) { var s = unescape(encodeURIComponent(JSON.stringify(o))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function b64d(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return JSON.parse(decodeURIComponent(escape(atob(s)))); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function stampOk(id) { return /^[0-9]{4}-[a-z]+-[0-9]+$/.test(id || "") && !!$('.pc-stamps input[value="' + id + '"]'); }
  function pic(id) { return /^[a-z0-9-]+$/.test(id || "") ? $('.pc-pics input[value="' + id + '"]') : null; }
  function serLine(pv) {
    var ser = pv.getAttribute("data-ser") || "views", no = pv.getAttribute("data-no") || "";
    return fill(u(ser === "palace" ? "serPalace" : "serPost"), { s: u("ser_" + ser), n: no });
  }
  function pmLines(c) {
    var d = c.d ? parseD(c.d) : today();
    var h = c.h != null && /^\d{1,2}$/.test(String(c.h)) ? " " + pad(+c.h) : "";
    return [String(c.p || "TALAS").slice(0, 24), pad(d.getUTCDate()) + "·" + pad(d.getUTCMonth() + 1) + "·" + String(d.getUTCFullYear()).slice(2) + h, "IRAD POCHTASY"];
  }
  function render(c) {
    var pv = pic(c.v) || $('.pc-pics input');
    if (pv) {
      $("#pc-fimg").src = "img/cards/" + pv.value + ".webp";
      $("#pc-fimg").alt = pv.getAttribute("data-" + LANG) || pv.getAttribute("data-en");
      $("#pc-fplace").textContent = pv.getAttribute("data-place");
      $("#pc-cap").textContent = (pv.getAttribute("data-" + LANG) || pv.getAttribute("data-en")) + " · " + serLine(pv);
      var pg = pv.getAttribute("data-page");
      $("#pc-palace").hidden = !pg;
      if (pg) $("#pc-palace-a").href = "https://palace.korkom.org/" + pg;
    }
    $("#pc-vmsg").textContent = c.m || "";
    $("#pc-vto").textContent = c.t ? u("dear") + ": " + c.t : "";
    $("#pc-vadr").textContent = c.a || "";
    $("#pc-vfrom").textContent = c.f ? u("from") + ": " + c.f : "";
    if (stampOk(c.s)) $("#pc-stp").src = "img/stamps/" + c.s + ".webp";
    $("#pc-pm").innerHTML = pmLines(c).map(esc).join("<br>");
  }
  function current() {
    var st = $('.pc-stamps input:checked'), pv = $('.pc-pics input:checked');
    var t = today();
    return { t: $("#pc-to").value.slice(0, 40), a: $("#pc-adr").value.slice(0, 60), m: $("#pc-msg").value.slice(0, 280), f: $("#pc-from").value.slice(0, 40), p: $("#pc-place").value, s: st ? st.value : "2026-horse-8", v: pv ? pv.value : "", d: t.getUTCFullYear() + "-" + pad(t.getUTCMonth() + 1) + "-" + pad(t.getUTCDate()), h: iradNow().getHours() };
  }
  /* the card as a picture: front above back, drawn in the browser; nothing is sent */
  function loadImg(src) { return new Promise(function (ok, no) { var i = new Image(); i.onload = function () { ok(i); }; i.onerror = no; i.src = src; }); }
  function wrap(g, text, maxW) {
    var out = [];
    String(text || "").split("\n").forEach(function (para) {
      var line = "";
      para.split(" ").forEach(function (w) {
        var t = line ? line + " " + w : w;
        if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
      });
      out.push(line);
    });
    return out;
  }
  function savePicture(c) {
    var pv = pic(c.v) || $('.pc-pics input'), W = 1500, H = 1000, GAP = 40;
    var hand = '"Caveat", "Segoe Print", "Bradley Hand", "Comic Sans MS", cursive', sans = "Inter, Arial, sans-serif";
    Promise.all([loadImg("img/cards/" + pv.value + ".webp"), loadImg("img/stamps/" + (stampOk(c.s) ? c.s : "2026-horse-8") + ".webp")]).then(function (im) {
      var cv = document.createElement("canvas"); cv.width = W; cv.height = H * 2 + GAP;
      var g = cv.getContext("2d");
      g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height);
      g.drawImage(im[0], 0, 0, W, H);
      var place = pv.getAttribute("data-place");
      if (place) {
        g.save(); g.translate(60, H - 70); g.rotate(-4 * Math.PI / 180);
        g.font = '110px "Lobster", "Brush Script MT", cursive'; g.fillStyle = "#fff";
        g.shadowColor = "rgba(0,0,0,.6)"; g.shadowBlur = 10; g.shadowOffsetY = 4; g.fillText(place, 0, 0); g.restore();
      }
      var y0 = H + GAP;
      g.fillStyle = "#fffdf6"; g.fillRect(0, y0, W, H);
      g.strokeStyle = "#d9d2bf"; g.lineWidth = 2; g.strokeRect(1, y0 + 1, W - 2, H - 2);
      var split = 820;
      g.beginPath(); g.moveTo(split, y0 + 110); g.lineTo(split, y0 + H - 60); g.stroke();
      g.fillStyle = "#8a826c"; g.font = "20px " + sans;
      wrap(g, (pv.getAttribute("data-" + LANG) || pv.getAttribute("data-en")) + " · " + serLine(pv), 760).slice(0, 3).forEach(function (l, i) { g.fillText(l, 40, y0 + 44 + i * 26); });
      g.fillStyle = "#23395d"; g.font = "48px " + hand;
      wrap(g, c.m, split - 90).slice(0, 13).forEach(function (l, i) { g.fillText(l, 50, y0 + 170 + i * 58); });
      var sw = im[1].width * 250 / im[1].height;
      g.save(); g.shadowColor = "rgba(0,0,0,.25)"; g.shadowBlur = 4; g.shadowOffsetY = 2;
      g.drawImage(im[1], W - 50 - sw, y0 + 40, sw, 250); g.restore();
      var cx = W - 50 - sw - 30, cy = y0 + 200, pm = pmLines(c);
      g.save(); g.translate(cx, cy); g.rotate(-12 * Math.PI / 180);
      g.strokeStyle = "rgba(20,40,90,.6)"; g.fillStyle = "rgba(20,40,90,.7)"; g.lineWidth = 5;
      g.beginPath(); g.arc(0, 0, 125, 0, 2 * Math.PI); g.stroke();
      g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 112, 0, 2 * Math.PI); g.stroke();
      g.textAlign = "center";
      g.font = "bold 22px " + sans; g.fillText(pm[0], 0, -34, 180); g.font = "bold 28px " + sans; g.fillText(pm[1], 0, 10, 190); g.font = "bold 18px " + sans; g.fillText(pm[2], 0, 48, 170);
      g.restore();
      g.fillStyle = "#23395d"; g.font = "44px " + hand;
      [c.t ? u("dear") + ": " + c.t : "", c.a || "", c.f ? u("from") + ": " + c.f : ""].forEach(function (l, i) {
        var ly = y0 + 640 + i * 100;
        g.fillText(l, split + 50, ly - 14, W - split - 100);
        g.strokeStyle = "#c9c1ab"; g.lineWidth = 2; g.beginPath(); g.moveTo(split + 50, ly); g.lineTo(W - 50, ly); g.stroke();
      });
      g.fillStyle = "#8a826c"; g.font = "bold 18px " + sans; g.textAlign = "left";
      g.fillText("IRAD POCHTASY · POCHTA KARTOCHKASI · ПОЧТОВАЯ КАРТОЧКА", 40, y0 + H - 26);
      var a = document.createElement("a");
      a.download = "irad-postcard-" + pv.value + ".png";
      try { a.href = cv.toDataURL("image/png"); } catch (e) { $("#pc-copied").textContent = u("saveFail"); return; }
      document.body.appendChild(a); a.click(); a.remove();
    }, function () { $("#pc-copied").textContent = u("saveFail"); });
  }
  if (form) {
    var m = location.hash.match(/^#c=([A-Za-z0-9_-]+)$/), want = location.hash.match(/^#v=([a-z0-9-]+)$/);
    if (m) {
      try { card = b64d(m[1]); } catch (e) { card = null; }
    }
    if (card && typeof card === "object") {
      form.hidden = true;
      $("#pc-joint").hidden = true;
      $("#pc-intro").textContent = u("gotCard");
      $("#pc-intro").removeAttribute("data-i18n");
      $("#pc-reply").hidden = false;
      render(card);
      $("#pc-save2").addEventListener("click", function () { savePicture(card); });
    } else {
      if (want && pic(want[1])) {
        pic(want[1]).checked = true;
        var box = pic(want[1]).closest(".pc-pics");
        if (box && box.scrollTo) box.scrollTop = pic(want[1]).parentNode.offsetTop - box.offsetTop - 8;
      }
      ["#pc-to", "#pc-adr", "#pc-msg", "#pc-from", "#pc-place"].forEach(function (s) { $(s).addEventListener("input", function () { render(current()); }); });
      $$('.pc-stamps input, .pc-pics input').forEach(function (r) { r.addEventListener("change", function () { render(current()); }); });
      render(current());
      $("#pc-copy").addEventListener("click", function () {
        var url = location.href.split("#")[0] + "#c=" + b64e(current());
        try { history.replaceState(null, "", url); } catch (e) {}
        var done = function () { $("#pc-copied").textContent = u("copied"); }, fail = function () { $("#pc-copied").textContent = u("copyFail"); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, fail); else fail();
      });
      $("#pc-save").addEventListener("click", function () { savePicture(current()); });
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
