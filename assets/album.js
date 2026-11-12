/* Irad Pochtasy: the stamp album. A control number fills its stamp's place; the album is kept in this browser
   (localStorage "post-album") and nothing is sent anywhere. */
(function () {
  "use strict";
  var K = {3755030294:"2004-heritage-37",2187548334:"2007-dri-5",3644530877:"2008-courier-1",874836107:"2008-courier-4",1988171312:"2008-courier-8",340699427:"2008-courier-20",2047573310:"2009-emblem-20",3138104270:"2014-silkroads-12",131732232:"2018-zharkyn-20",3056135697:"2019-akyel-12",4225586008:"2021-komuz-8",1888232071:"2022-ibex-8",1521202598:"2024-janyl-12",3984761656:"2026-horse-8",2690529748:"2026-horse-20",2206307504:"2026-toktogul-12"};
  var M = {
    ok: { en: "Into the album: ", ir: "Albomgo salındı: ", ru: "Вклеена в альбом: " },
    had: { en: "This stamp is already in your album.", ir: "Bul marka albomuñuzda bar.", ru: "Эта марка уже есть в альбоме." },
    bad: { en: "No stamp has this control number. Check the letters and digits.", ir: "Mından kontrol nomeri bar marka jok. Tamgalardı jana sıfralardı tekshiriñiz.", ru: "Марки с таким контрольным номером нет. Проверьте буквы и цифры." },
    all: { en: "The album is full. The Philatelic Bureau, counter 1, Talas Central Post Office, would like to hear from you.", ir: "Albom toldu. Filateliya byurosu (1-kassa, Talas borborduk pochtası) siz menen taanıshkısı kelet.", ru: "Альбом заполнен. Филателистическое бюро (окно 1, Таласский почтамт) будет радо вас видеть." }
  };
  function lang() { var l = document.documentElement.lang || "en"; return l.indexOf("ky") === 0 ? "ir" : l === "ru" ? "ru" : "en"; }
  function h(s) { var x = 2166136261; for (var i = 0; i < s.length; i++) { x ^= s.charCodeAt(i); x = Math.imul(x, 16777619); } return x >>> 0; }
  function load() { try { return JSON.parse(localStorage.getItem("post-album") || "[]"); } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem("post-album", JSON.stringify(a)); } catch (e) {} }
  var grid = document.getElementById("al-grid"); if (!grid) return;
  var last = null;
  function draw() {
    var have = load(), n = 0;
    Array.prototype.forEach.call(grid.querySelectorAll(".slot"), function (li) {
      var id = li.getAttribute("data-id"), on = have.indexOf(id) >= 0, hole = li.querySelector(".hole");
      if (on) { n++; if (!hole.querySelector("img")) hole.innerHTML = '<img src="img/stamps/' + id + '.webp" alt="" loading="lazy">'; li.classList.add("on"); }
    });
    document.getElementById("al-n").textContent = n;
    var msg = document.getElementById("al-msg");
    if (last) msg.textContent = last.k === "ok" ? M.ok[lang()] + last.t : M[last.k][lang()];
    if (n === grid.querySelectorAll(".slot").length && (!last || last.k === "ok")) msg.textContent = (last ? msg.textContent + " " : "") + M.all[lang()];
  }
  document.getElementById("al-f").addEventListener("submit", function (e) {
    e.preventDefault();
    var inp = document.getElementById("al-c"), c = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, ""), id = K[h("pochta|" + c)];
    if (!id) last = { k: "bad" };
    else {
      var a = load(), li = grid.querySelector('[data-id="' + id + '"]');
      if (a.indexOf(id) >= 0) last = { k: "had" }; else { a.push(id); save(a); last = { k: "ok", t: li ? li.querySelector(".cap").textContent : id }; inp.value = ""; }
      if (li) li.scrollIntoView({ block: "nearest" });
    }
    draw();
  });
  var prev = window.__postRerender; window.__postRerender = function () { if (prev) prev(); draw(); };
  draw();
})();
