/* Generador «Prueba tu web»: arma en el navegador la misma demo pro que las propuestas (demos/_assets/demo.css).
   Todo ocurre en el navegador del visitante; no se guarda nada. */
(function () {
  "use strict";
  var B = "https://ioritz13.github.io/propuestas/";
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var I = {
    tel: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7a11.6 11.6 0 0 1-4.6-4c-.3-.5-1-1.4-1-2.6s.7-1.9.9-2.2c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.8-.1 1.4z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };
  function telFmt(t) { return t && t.length === 9 ? t.slice(0, 3) + " " + t.slice(3, 5) + " " + t.slice(5, 7) + " " + t.slice(7) : t; }

  var PALETAS = {
    "Noche y oro": ["#111111", "#181716", "#1c1b19", "#f2ece2", "#b2a99b", "#2d2a26", "#c8a165", "#15120e"],
    "Blanco elegante": ["#fafaf8", "#f0efeb", "#ffffff", "#161616", "#5a5a5a", "#e2e0da", "#161616", "#ffffff"],
    "Rosa empolvado": ["#fbf3f3", "#f5e6e7", "#ffffff", "#2b1d20", "#6e5a5f", "#ecdcdd", "#c2667a", "#ffffff"],
    "Verde natural": ["#f4f7f2", "#e6eee3", "#ffffff", "#1d2a20", "#56655a", "#d6e1d3", "#3f7d4e", "#ffffff"],
    "Azul moderno": ["#f5f8fc", "#e8eef7", "#ffffff", "#0f1b2d", "#4f5d70", "#dbe3ee", "#1d4ed8", "#ffffff"],
    "Terracota": ["#fbf6ef", "#f3eadd", "#fffaf3", "#2a1d14", "#6b5848", "#e8dac7", "#b4441d", "#ffffff"],
    "Lila": ["#f8f5fc", "#eee7f7", "#ffffff", "#231a33", "#62577a", "#e2d9ef", "#7c4dbd", "#ffffff"],
    "Negro y rojo": ["#0d0d0e", "#151517", "#19191b", "#ece6da", "#a9a398", "#2a2a2d", "#d6453d", "#ffffff"]
  };
  window.PALETAS_GEN = Object.keys(PALETAS);
  function estiloBody(nombre) {
    var p = PALETAS[nombre]; if (!p) return "";
    var k = ["--bg", "--bg-2", "--card", "--ink", "--ink-2", "--line", "--accent", "--accent-ink"];
    return ' style="' + k.map(function (x, i) { return x + ":" + p[i]; }).join(";") + '"';
  }
  window.crearPro = function (D, n, sector, t, dir, serv) {
    var selEst = document.getElementById("estilo"), estilo = selEst ? selEst.value : "";
    var s = D.sectores[sector] || D.sectores.peluqueria;
    var tema = sector === "tatuajes" ? "tatuajes" : (s.tema || sector);
    var cp = D.copia[s.fam || sector] || D.copia[tema] || D.copia.estetica;
    var fotos = ("fotos" in s) ? s.fotos : (D.fotos[sector] || D.fotos[tema] || null);   // null = sin foto (mejor que una que no encaja)
    var movil = /^[67]\d{8}$/.test(t);
    var cEl = document.getElementById("ciudad"), ciudad = (cEl && cEl.value.trim()) || "Vitoria-Gasteiz";   // el negocio puede estar en cualquier ciudad
    var calle = dir || ciudad;
    var direccion = dir ? dir + ", " + ciudad : ciudad;
    s = Object.assign({}, s, {lema: s.lema.split("Vitoria-Gasteiz").join(ciudad)});
    var q = encodeURIComponent(n + " " + direccion);
    var maps = "https://www.google.com/maps/search/?api=1&query=" + q;
    var ini = (n.match(/[A-Za-zÁÉÍÓÚÑáéíóúñ]+/g) || [n]).filter(function (w) { return ["de", "la", "el", "y", "los", "las", "del"].indexOf(w.toLowerCase()) < 0; })
      .map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase() || n.charAt(0).toUpperCase();
    var waNeg = movil ? "https://wa.me/34" + t : "";
    // servicios: los que escribe el visitante (con precio si lo pone) o los típicos del sector
    var lineas = (serv || "").split(/\n/).map(function (l) { return l.trim(); }).filter(Boolean).slice(0, 10);
    var filas = (lineas.length ? lineas : s.servicios).map(function (l) {
      var m = l.match(/^(.*?)[\s:–-]*(\d+(?:[.,]\d{1,2})?)\s*(€|eur|euros)?\s*$/i);
      var nombre = m && m[1] ? m[1] : l, precio = m && m[1] ? m[2] + " €" : "";
      var d = D.desc[nombre] || "";
      return '<li><div><span class="n">' + esc(nombre) + '</span>' + (d ? '<span class="d">' + esc(d) + "</span>" : "") + "</div>" +
        (precio ? '<span class="p">' + esc(precio) + "</span>" : '<span class="ask">Consultar ' + I.arrow + "</span>") + "</li>";
    }).join("");
    var bMain = movil ? '<a class="btn b-wa" href="' + waNeg + '" target="_blank" rel="noopener">' + I.wa + " " + esc(cp.cta) + " por WhatsApp</a>"
      : t ? '<a class="btn b-main" href="tel:+34' + t + '">' + I.tel + " " + esc(cp.cta) + " · " + telFmt(t) + "</a>" : "";
    var bSec = movil ? '<a class="btn b-glass" href="tel:+34' + t + '">' + I.tel + " Llamar · " + telFmt(t) + "</a>" : "";
    var pasos = cp.pasos ? '<section class="alt"><div class="wrap"><div class="eyebrow">' + esc(cp.pasos_t || "Cómo pedir cita") + '</div><h2>En tres pasos</h2><div class="steps">' +
      cp.pasos.map(function (p) { return '<div class="step"><h3>' + esc(p[0]) + "</h3><p>" + esc(p[1].replace("{calle}", calle)) + "</p></div>"; }).join("") + "</div></div></section>" : "";
    var gal = fotos && fotos.galeria && fotos.galeria.length ? '<section><div class="wrap"><div class="eyebrow">El local</div><h2>Así trabajamos</h2><div class="gal">' +
      fotos.galeria.slice(0, 3).map(function (g) { return '<figure><img src="' + B + "_fotos/" + g + '" alt=""><span class="ph-tag">Foto de ejemplo</span></figure>'; }).join("") + "</div></div></section>" : "";
    var contacto = (t ? '<li>' + I.tel + '<div><b>Teléfono</b><a href="tel:+34' + t + '">' + telFmt(t) + "</a></div></li>" : "") +
      (movil ? '<li>' + I.wa + '<div><b>WhatsApp</b><a href="' + waNeg + '" target="_blank" rel="noopener">Escríbenos</a></div></li>' : "") +
      '<li>' + I.pin + "<div><b>Dirección</b><span>" + esc(direccion) + "</span></div></li>";
    var bar = movil ? '<div class="bar"><a class="btn b-main" href="tel:+34' + t + '">' + I.tel + ' Llamar</a><a class="btn b-wa" href="' + waNeg + '" target="_blank" rel="noopener">' + I.wa + " WhatsApp</a></div>"
      : t ? '<div class="bar"><a class="btn b-main" href="tel:+34' + t + '">' + I.tel + " Llamar · " + telFmt(t) + "</a></div>" : "";
    var largo = Math.max.apply(null, n.split(/\s+/).map(function (w) { return w.length; }));
    var h1c = largo >= 12 ? ' class="muylargo"' : (largo >= 10 || n.length > 26 ? ' class="largo"' : "");
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="stylesheet" href="' + B + '_assets/demo.css"><title>' + esc(n) + "</title></head><body class=\"t-" + tema + '"' + estiloBody(estilo || s.paleta || "") + ">" +
      '<div class="pr-ribbon"><div class="wrap"><span><i></i><em>Vista previa gratis de tu web</em></span></div></div>' +
      '<header class="top"><div class="wrap"><a class="brand" href="#"><span class="mono">' + esc(ini) + "</span><b>" + esc(n) + "</b></a><nav>" +
      (t ? '<a class="btn b-main" href="tel:+34' + t + '">' + I.tel + " Llamar</a>" : "") + "</nav></div></header>" +
      '<div class="hero' + (fotos && fotos.hero ? "" : " nofoto") + '"' + (fotos && fotos.hero ? "" : ' data-ini="' + esc(ini) + '"') + ">" +
      (fotos && fotos.hero ? '<img src="' + B + "_fotos/" + fotos.hero + '" alt=""><span class="ph-tag">Foto de ejemplo</span>' : "") +
      '<div class="wrap"><div class="eyebrow">' + esc(s.txt) + " · " + esc(ciudad) + "</div><h1" + h1c + ">" + esc(n) + '</h1><p class="lead">' + esc(s.lema) + "</p>" +
      '<div class="cta">' + bMain + bSec + '</div><div class="chips"><a class="chip" href="' + maps + '" target="_blank" rel="noopener">' + I.pin + " " + esc(calle) + "</a></div></div></div>" +
      '<section id="servicios"><div class="wrap"><div class="eyebrow">' + esc(cp.svc_t) + "</div><h2>" + esc(cp.svc_h || "Lo que hacemos") + "</h2>" +
      '<p class="sub">Pregunta sin compromiso: te contestamos enseguida.</p><ul class="svc" style="margin-top:28px">' + filas + "</ul>" +
      (lineas.length ? "" : '<p class="note"><b>Servicios de ejemplo.</b> En tu web van los tuyos, con tus precios.</p>') + "</div></section>" +
      pasos + gal +
      '<section class="alt"><div class="wrap about"><div><div class="eyebrow">Sobre nosotros</div><h2>' + esc(n) + '</h2><p class="txt">' + esc(cp.sobre.replace("{n}", n)) + "</p></div>" +
      '<div class="facts"><div class="fact">' + I.check + "<div><b>" + esc(cp.cita_t || "Cómo pedir cita") + "</b><span>" + (t ? (movil ? "Por WhatsApp o llamando al " : "Llamando al ") + telFmt(t) + "." : "Pásate a vernos.") + "</span></div></div>" +
      '<div class="fact">' + I.check + "<div><b>Dónde estamos</b><span>" + esc(direccion) + "</span></div></div></div></div></section>" +
      '<section><div class="wrap"><div class="eyebrow">Opiniones</div><h2>Lo que dicen de nosotros</h2><div class="rev"><div><h3>¿Ya nos conoces?</h3>' +
      '<p>Tu opinión en Google ayuda a que más gente nos encuentre. ¡Gracias!</p></div><a class="btn b-main" href="' + maps + '" target="_blank" rel="noopener">Dejar una opinión en Google ' + I.arrow + "</a></div></div></section>" +
      '<section><div class="wrap"><div class="eyebrow">Horario y contacto</div><h2>Ven a vernos</h2><div class="info">' +
      '<div class="box"><h3>Horario</h3><p style="color:var(--ink-2);margin-bottom:16px">Aquí va tu horario, con el día de hoy marcado y si estás abierto ahora.</p>' +
      '<a class="btn b-line" href="' + maps + '" target="_blank" rel="noopener">' + I.clock + " Ver en Google</a></div>" +
      '<div class="box"><h3>Contacto</h3><ul class="clist">' + contacto + "</ul></div></div></div></section>" +
      '<section class="final"><div class="wrap"><h2>' + esc(cp.final) + "</h2><p>" + esc(n) + " · " + esc(calle) + '</p><div class="cta">' +
      (movil ? '<a class="btn b-main" href="' + waNeg + '" target="_blank" rel="noopener">' + I.wa + " Escribir por WhatsApp</a>" : "") +
      (t ? '<a class="btn b-line" href="tel:+34' + t + '">' + I.tel + " " + telFmt(t) + "</a>" : "") + "</div></div></section>" +
      '<footer class="site"><div class="wrap"><span>© 2026 ' + esc(n) + "</span><span>Vista previa gratis · Ioritz Martínez</span></div></footer>" +
      bar + "</body></html>";
  };
})();
