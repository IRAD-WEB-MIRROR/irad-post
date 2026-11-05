/* Stamp of the month: shows the month's stamp by the Irad date (UTC+6). */
(function () {
  var box = document.getElementById("stamp-of-the-month");
  if (!box) return;
  var items = [].slice.call(box.querySelectorAll("[data-som]"));
  if (!items.length) return;
  var d = new Date(Date.now() + 6 * 36e5), y = d.getUTCFullYear(), m = d.getUTCMonth() + 1;
  var same = [], rest = [];
  items.forEach(function (el, n) { (parseInt(el.getAttribute("data-m"), 10) === m ? same : rest).push(n); });
  var pick = same.length ? same[y % same.length] : rest[(y * 12 + m - 1) % rest.length];
  items.forEach(function (el, n) { el.hidden = n !== pick; });
})();
