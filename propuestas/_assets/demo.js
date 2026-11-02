/* Demos "pro": horario en vivo, mapa, hoja de propuesta, «Cámbiala tú mismo» y Radar (avisos a Ioritz vía ntfy).
   Sin cookies. Solo se guarda en este navegador lo que el propio negocio edita (para no perderlo al recargar). */
(function () {
  "use strict";
  var cfgEl = document.getElementById("cfg");
  if (!cfgEl) return;
  var C = JSON.parse(cfgEl.textContent);
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var IORITZ = "34692024735";
  var KEY = "edit:" + location.pathname;

  /* ---------- Radar ---------- */
  var radarOn = !!C.topic && !navigator.webdriver;
  var prueba = /[?&]radar=test/.test(location.search);
  try {
    if (location.hash === "#yo") localStorage.setItem("radar-off", "1");
    if (localStorage.getItem("radar-off")) radarOn = false;
  } catch (e) {}
  if (prueba) radarOn = true;
  var enviados = {};
  function disp() {
    var u = navigator.userAgent;
    return /iPhone|iPad/.test(u) ? "iPhone" : /Android/.test(u) ? "Android" : /Macintosh/.test(u) ? "Mac" : /Windows/.test(u) ? "PC" : "otro";
  }
  function origen() {
    var q = (location.search.match(/[?&]qr=([a-z]+)/) || [])[1];
    return q === "hoja" ? "desde la hoja que dejaste" : q === "tarjeta" ? "desde tu tarjeta" : "desde el enlace";
  }
  function radar(tipo, titulo, cuerpo, prio, tag) {
    if (!radarOn || enviados[tipo]) return;
    enviados[tipo] = 1;
    var url = "https://ntfy.sh/" + C.topic + "?title=" + encodeURIComponent((prueba ? "[PRUEBA] " : "") + titulo) +
      "&tags=" + encodeURIComponent(tag) + "&priority=" + prio + "&click=" + encodeURIComponent(C.click || C.url);
    var body = (cuerpo ? cuerpo + "\n" : "") + "(" + disp() + ", " + origen() + ") #" + C.id + " #" + tipo;
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(url, new Blob([body], { type: "text/plain" }))) return;
    } catch (e) {}
    try { fetch(url, { method: "POST", body: body, mode: "no-cors", keepalive: true }); } catch (e) {}
  }
  setTimeout(function () {
    if (document.visibilityState === "visible")
      radar("abre", C.n + " ha abierto su web", "Buen momento para escribirle.", 3, "eyes");
  }, 2500);

  /* ---------- horario: hoy y abierto ahora ---------- */
  var ahora = new Date();
  var dia = (ahora.getDay() + 6) % 7; // 0 = lunes
  var min = ahora.getHours() * 60 + ahora.getMinutes();
  $$(".hours tr[data-d]").forEach(function (tr) {
    if (tr.getAttribute("data-d").split(",").indexOf(String(dia)) >= 0) tr.classList.add("hoy");
  });
  function aMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function estado() {
    var s = C.semana;
    if (!s || !s[dia]) return null;
    var hoy = s[dia];
    for (var i = 0; i < hoy.length; i++)
      if (min >= aMin(hoy[i][0]) && min < aMin(hoy[i][1])) return { on: true, t: "Abierto ahora · hasta las " + hoy[i][1] };
    for (i = 0; i < hoy.length; i++)
      if (min < aMin(hoy[i][0])) return { on: false, t: "Cerrado ahora · abre a las " + hoy[i][0] };
    for (var k = 1; k <= 7; k++) {
      var d = s[(dia + k) % 7];
      if (d === null) return { on: false, t: "Cerrado ahora" };
      if (d.length) return { on: false, t: "Cerrado ahora · abre " + (k === 1 ? "mañana" : ["el lunes", "el martes", "el miércoles", "el jueves", "el viernes", "el sábado", "el domingo"][(dia + k) % 7]) + " a las " + d[0][0] };
    }
    return null;
  }
  var est = estado();
  $$("[data-estado]").forEach(function (el) {
    if (!est) { el.hidden = true; return; }
    var dot = el.querySelector(".dot"), t = el.querySelector("span:last-child");
    if (dot) dot.classList.toggle("on", est.on);
    if (t) t.textContent = est.t;
    el.hidden = false;
  });

  /* ---------- mapa ---------- */
  var bMap = $("[data-mapa]");
  if (bMap) bMap.addEventListener("click", function () {
    var m = $(".map");
    var f = document.createElement("iframe");
    f.loading = "lazy"; f.title = "Mapa"; f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(C.mapa) + "&output=embed";
    m.appendChild(f);
  });

  /* ---------- hoja de la propuesta ---------- */
  var sheet = $("#prop");
  function abrirProp() {
    radar("precio", C.n + " está mirando la propuesta", "Ha abierto el precio y los packs.", 4, "moneybag");
    if (sheet && sheet.showModal) { sheet.showModal(); } else { var z = $("#propuesta"); if (z) z.scrollIntoView(); }
  }
  $$("[data-prop]").forEach(function (b) { b.addEventListener("click", abrirProp); });
  if (sheet) {
    sheet.addEventListener("click", function (e) { if (e.target === sheet) sheet.close(); });
    $$("[data-cerrar]", sheet).forEach(function (b) { b.addEventListener("click", function () { sheet.close(); }); });
  }
  var zona = $("#propuesta");
  if (zona && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es, o) {
      es.forEach(function (e) {
        if (e.isIntersecting) { radar("precio", C.n + " está mirando la propuesta", "Ha llegado al final de la web, donde está el precio.", 4, "moneybag"); o.disconnect(); }
      });
    }, { threshold: 0.35 }).observe(zona);
  }
  var pill = $(".pr-pill");
  function verPill() { if (pill) pill.classList.add("on"); }
  setTimeout(verPill, 7000);
  window.addEventListener("scroll", function () {
    if (window.scrollY > window.innerHeight * 0.9) verPill();
  }, { passive: true });

  function wa(texto) { return "https://wa.me/" + IORITZ + "?text=" + encodeURIComponent(texto); }
  $$("[data-quiero]").forEach(function (a) {
    a.href = wa("Hola Ioritz, soy de " + C.n + ". He visto la web que nos has preparado y la queremos. ¿Cómo seguimos? " + C.url);
    a.addEventListener("click", function () { radar("quiero", C.n + " ha pulsado «La quiero»", "Escríbele ya: está listo para decir que sí.", 5, "fire"); });
  });
  $$("[data-no]").forEach(function (a) {
    a.addEventListener("click", function () { radar("no", C.n + " no está interesado", "Ha pulsado «Dímelo y la borro». No le vuelvas a escribir.", 3, "no_entry"); });
  });
  $$("[data-duda]").forEach(function (a) {
    a.href = wa("Hola Ioritz, soy de " + C.n + ". He visto la web que nos has preparado y tengo una duda: ");
    a.addEventListener("click", function () { radar("duda", C.n + " tiene una duda", "Ha pulsado «Tengo una duda». Mira tu WhatsApp.", 4, "question"); });
  });

  /* ---------- «Cámbiala tú mismo» ---------- */
  var lista = $(".svc");
  function fila(n, p) {
    var li = document.createElement("li");
    li.innerHTML = '<div><span class="n" data-e data-l="servicio"></span></div><a class="ask" data-e data-l="precio"></a>';
    li.querySelector(".n").textContent = n;
    var a = li.querySelector(".ask"); a.textContent = p || "Consultar";
    return li;
  }
  function editables() { return $$("[data-e]"); }
  function guardar() {
    try {
      var d = { k: {}, s: [] };
      $$("[data-k]").forEach(function (el) { d.k[el.getAttribute("data-k")] = el.textContent.trim(); });
      if (lista) $$("li", lista).forEach(function (li) {
        var n = li.querySelector(".n"), p = li.querySelector(".ask,.p");
        if (n && n.textContent.trim()) d.s.push([n.textContent.trim(), p ? p.textContent.trim() : ""]);
      });
      localStorage.setItem(KEY, JSON.stringify(d));
    } catch (e) {}
  }
  function precioBonito() {
    if (!lista) return;
    $$("li", lista).forEach(function (li) {
      var a = li.querySelector(".ask,.p");
      if (!a) return;
      var t = a.textContent.trim();
      var esPrecio = t && !/^consultar$/i.test(t);
      a.className = esPrecio ? "p" : "ask";
      if (esPrecio) { a.removeAttribute("href"); a.removeAttribute("target"); }
      else {
        var n = (li.querySelector(".n") || {}).textContent || "";
        if (C.tel && /^[67]/.test(C.tel)) {
          a.href = "https://wa.me/34" + C.tel + "?text=" + encodeURIComponent("Hola, quería información sobre: " + n.trim());
          a.target = "_blank"; a.rel = "noopener";
        } else if (C.tel) a.href = "tel:+34" + C.tel;
        if (!a.querySelector("svg")) a.insertAdjacentHTML("beforeend", ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
      }
    });
  }
  // restaurar lo que el negocio ya había cambiado en este navegador
  try {
    var g = JSON.parse(localStorage.getItem(KEY) || "null");
    if (g) {
      $$("[data-k]").forEach(function (el) { var v = g.k[el.getAttribute("data-k")]; if (v) el.textContent = v; });
      if (lista && g.s && g.s.length) { lista.innerHTML = ""; g.s.forEach(function (x) { lista.appendChild(fila(x[0], x[1])); }); }
    }
  } catch (e) {}
  precioBonito();

  function entrar() {
    if (sheet && sheet.open) sheet.close();
    document.body.classList.add("editando");
    editables().forEach(function (el) {
      try { el.contentEditable = "plaintext-only"; } catch (e) { el.contentEditable = "true"; }
      if (el.contentEditable !== "plaintext-only") el.contentEditable = "true";
      el.spellcheck = false;
    });
    var s = $("#servicios"); if (s) s.scrollIntoView({ behavior: "smooth", block: "start" });
    radar("editar", C.n + " está cambiando su web", "Ha abierto «Cámbiala tú mismo»: está interesado.", 4, "pencil2");
  }
  function salir() {
    document.body.classList.remove("editando");
    editables().forEach(function (el) { el.removeAttribute("contenteditable"); });
    precioBonito(); guardar();
  }
  document.addEventListener("click", function (e) {
    if (document.body.classList.contains("editando") && e.target.closest("[data-e]")) e.preventDefault();
  }, true);
  document.addEventListener("input", function (e) { if (e.target.closest && e.target.closest("[data-e]")) guardar(); });
  $$("[data-editar]").forEach(function (b) { b.addEventListener("click", entrar); });
  $$("[data-salir]").forEach(function (b) { b.addEventListener("click", salir); });
  $$("[data-add]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!lista) return;
      var li = fila("Nuevo servicio", "Consultar");
      lista.appendChild(li);
      $$("[data-e]", li).forEach(function (el) { el.contentEditable = "true"; });
      var n = li.querySelector(".n"); n.focus();
      try { document.getSelection().selectAllChildren(n); } catch (e) {}
    });
  });
  $$("[data-enviar]").forEach(function (b) {
    b.addEventListener("click", function () {
      guardar();
      var L = ["Hola Ioritz, soy de " + C.n + ". Así quiero mi web:"], cambios = [];
      $$("[data-k]").forEach(function (el) {
        var t = el.textContent.trim(), o = el.getAttribute("data-o");
        if (t && t !== o && t !== "—") cambios.push(el.getAttribute("data-l") + ": " + t);
      });
      if (cambios.length) L.push("", cambios.join("\n"));
      if (lista) {
        L.push("", "Servicios y precios:");
        $$("li", lista).forEach(function (li) {
          var n = li.querySelector(".n"), p = li.querySelector(".ask,.p");
          var pt = p ? p.textContent.trim() : "";
          if (/^(consultar|precio|—|-)?$/i.test(pt)) pt = "";
          if (n && n.textContent.trim()) L.push("· " + n.textContent.trim() + (pt ? " — " + pt : ""));
        });
      }
      L.push("", C.url);
      var txt = L.join("\n");
      radar("enviar", C.n + " te ha mandado sus cambios", txt.slice(0, 3500), 5, "incoming_envelope");
      window.open(wa(txt), "_blank");
    });
  });
})();
