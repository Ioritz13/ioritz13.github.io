/* Plazas de lanzamiento: rellena los [data-plazas] con «Quedan N de 5» (datos reales: plazas.json, lo actualiza Claude al publicar cada cliente).
   Mientras no haya ningún cliente no enseña nada. */
(function () {
  fetch("/plazas.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (p) {
    if (!p || !p.ocupadas) return;
    var q = Math.max(0, p.total - p.ocupadas);
    var t = q === 0 ? "Plazas de lanzamiento agotadas." : q === 1 ? "¡Queda 1 plaza a precio de lanzamiento!" : "Quedan " + q + " de " + p.total + " plazas a precio de lanzamiento.";
    document.querySelectorAll("[data-plazas]").forEach(function (el) { el.textContent = t; el.hidden = false; });
  }).catch(function () {});
})();
