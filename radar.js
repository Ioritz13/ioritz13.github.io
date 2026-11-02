/* Radar: avisa al móvil de Ioritz (ntfy.sh) cuando alguien escanea su tarjeta o usa sus herramientas. Sin cookies.
   En el móvil de Ioritz se silencia abriendo una vez /yo/. */
(function () {
  var T = "radar-iori-w55l9b611ksj13";
  var prueba = /[?&]radar=test/.test(location.search);
  function off() { try { return !!localStorage.getItem("radar-off"); } catch (e) { return false; } }
  function disp() { var u = navigator.userAgent; return /iPhone|iPad/.test(u) ? "iPhone" : /Android/.test(u) ? "Android" : /Macintosh/.test(u) ? "Mac" : /Windows/.test(u) ? "PC" : "otro"; }
  var hecho = {};
  window.radar = function (tipo, titulo, cuerpo, prio, tag, click) {
    if (hecho[tipo] || ((navigator.webdriver || off()) && !prueba)) return;
    hecho[tipo] = 1;
    var u = "https://ntfy.sh/" + T + "?title=" + encodeURIComponent((prueba ? "[PRUEBA] " : "") + titulo) + "&tags=" + encodeURIComponent(tag || "bell") +
      "&priority=" + (prio || 3) + (click ? "&click=" + encodeURIComponent(click) : "");
    var b = (cuerpo ? cuerpo + "\n" : "") + "(" + disp() + ")";
    try { if (navigator.sendBeacon && navigator.sendBeacon(u, new Blob([b], { type: "text/plain" }))) return; } catch (e) {}
    try { fetch(u, { method: "POST", body: b, mode: "no-cors", keepalive: true }); } catch (e) {}
  };
  var qr = (location.search.match(/[?&]qr=([a-z]+)/) || [])[1];
  if (qr) setTimeout(function () {
    window.radar("qr", qr === "tarjeta" ? "Alguien ha escaneado tu tarjeta" : "Alguien ha escaneado la hoja que dejaste",
      "Ha entrado en " + location.pathname + ". Si hoy diste tarjetas u hojas, puede ser uno de ellos.", 4, "card_index", location.origin + location.pathname);
  }, 1500);
})();
