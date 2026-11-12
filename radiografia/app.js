/* Radiografía en Google · lógica del front (sin dependencias).
   El backend es un Web App de Google Apps Script (radiografia/backend.gs en el proyecto).
   Pega aquí la URL que termina en /exec al desplegarlo: */
var API_URL = "https://script.google.com/macros/s/AKfycbzANYPXVl3Szaw1Qn2u_fIgaln075YorUeRhbCQ4Q3LFKOqhOYbgztnOlwaKLp2vVfbIw/exec";

(function () {
  "use strict";

  var TEL_IORITZ = "34692024735";

  // Puntos de cada comprobación (suman 100)
  var PUNTOS = { ok: 35, movil: 12, https: 6, botonLlamar: 12, whatsapp: 12, precios: 12, horario: 6, sitemap: 5 };

  // Textos exactos de los fallos y su versión corta para el WhatsApp
  var FALLOS = {
    sinWeb: ["No tienes web propia: te buscan en Google y no te encuentran.", "no tengo web propia"],
    noCarga: ["Tu web no carga o no responde.", "mi web no carga"],
    movil: ["Tu web no se adapta al móvil (donde te busca la mayoría).", "no se adapta al móvil"],
    https: ["Tu web no es segura (https): Google la marca y te penaliza.", "no es segura (https)"],
    botonLlamar: ["Tu web no tiene botón de llamar: el cliente tiene que buscar tu número.", "no tiene botón de llamar"],
    whatsapp: ["Tu web no tiene botón de WhatsApp.", "no tiene botón de WhatsApp"],
    precios: ["Tu web no muestra precios ni servicios.", "no muestra precios ni servicios"],
    horario: ["Tu web no muestra el horario.", "no muestra el horario"],
    sitemap: ["Tu web no tiene sitemap (a Google le cuesta indexarla).", "no tiene sitemap"]
  };
  var BIEN = {
    ok: "Tienes web propia y carga bien.",
    movil: "Se adapta al móvil.",
    https: "Es segura (https).",
    botonLlamar: "Tiene botón de llamar.",
    whatsapp: "Tiene botón de WhatsApp.",
    precios: "Muestra precios o servicios.",
    horario: "Muestra el horario.",
    sitemap: "Tiene sitemap para Google."
  };
  var ORDEN = ["movil", "https", "botonLlamar", "whatsapp", "precios", "horario", "sitemap"];

  var $ = function (s) { return document.querySelector(s); };
  var estado = { nombre: "", tieneWeb: null, url: "", nota: 0, fallos: [], cortos: [], id: "" };

  // ---------- navegación ----------
  function mostrar(id) {
    document.querySelectorAll(".pantalla").forEach(function (p) { p.hidden = p.id !== id; });
    window.scrollTo(0, 0);
    var h = document.querySelector("#" + id + " h1, #" + id + " h2");
    if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  function aviso(t) {
    var a = $("#aviso"); a.textContent = t; a.hidden = false;
    clearTimeout(aviso.t); aviso.t = setTimeout(function () { a.hidden = true; }, 2600);
  }
  document.querySelectorAll("[data-volver]").forEach(function (b) {
    b.addEventListener("click", function () { mostrar(b.getAttribute("data-volver")); });
  });

  // ---------- pantalla 1 ----------
  $("#f-inicio").addEventListener("submit", function (e) {
    e.preventDefault();
    var n = $("#nombre").value.trim().replace(/\s+/g, " ");
    $("#e-nombre").hidden = !!n;
    if (!n) { $("#nombre").focus(); return; }
    estado.nombre = n.slice(0, 80);
    $("#n-web").textContent = estado.nombre;
    mostrar("p-web");
  });

  // ---------- pantalla 2 ----------
  document.querySelectorAll(".opcion").forEach(function (o) {
    o.addEventListener("click", function () {
      estado.tieneWeb = o.getAttribute("data-web") === "si";
      document.querySelectorAll(".opcion").forEach(function (x) { x.setAttribute("aria-checked", String(x === o)); });
      $("#campo-url").hidden = !estado.tieneWeb;
      $("#e-web").hidden = true;
      if (estado.tieneWeb) $("#url").focus();
    });
  });

  function limpiarUrl(v) {
    v = (v || "").trim().replace(/\s+/g, "");
    if (!v) return "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v.replace(/^\/+/, "");
    try {
      var u = new URL(v);
      if (!/\./.test(u.hostname)) return "";
      return u.href;
    } catch (e) { return ""; }
  }

  $("#f-web").addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("#e-web");
    if (estado.tieneWeb === null) { err.textContent = "Elige una opción: «Sí, tengo web» o «No tengo web»."; err.hidden = false; return; }
    if (estado.tieneWeb) {
      var bruto = $("#url").value;
      var u = limpiarUrl(bruto);
      if (!u) { err.textContent = "Pega la dirección de tu web, por ejemplo: peluqueriaane.com"; err.hidden = false; $("#url").focus(); return; }
      estado.url = u;
      estado.urlEscrita = bruto.trim();
      err.hidden = true;
      auditar();
    } else {
      estado.url = "";
      resultado(null);
    }
  });

  // ---------- auditoría ----------
  function animarPasos() {
    var lis = document.querySelectorAll("#pasos li"), i = 0;
    lis.forEach(function (l) { l.classList.remove("hecho"); });
    clearInterval(animarPasos.t);
    animarPasos.t = setInterval(function () { if (lis[i]) lis[i++].classList.add("hecho"); else clearInterval(animarPasos.t); }, 900);
  }

  function auditar() {
    mostrar("p-cargando");
    animarPasos();
    var inicio = Date.now();
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var corta = setTimeout(function () { if (ctrl) ctrl.abort(); }, 30000);
    // Se manda tal cual lo escribió (sin «https://» añadido): el servidor prueba https y, si no, http
    var q = encodeURIComponent(/^https?:\/\//i.test(estado.urlEscrita) ? estado.url : estado.url.replace(/^https:\/\//i, ""));
    if (!API_URL) { setTimeout(function () { fallo("sin_api"); }, 1200); return; }
    fetch(API_URL + "?url=" + q, { signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        clearTimeout(corta);
        // que se vea el escáner al menos 3 s: la gente se fía más de un análisis que tarda un poco
        setTimeout(function () { resultado(d); }, Math.max(0, 3200 - (Date.now() - inicio)));
      })
      .catch(function () { clearTimeout(corta); fallo("red"); });
  }

  function fallo() {
    clearInterval(animarPasos.t);
    mostrar("p-web");
    var err = $("#e-web");
    err.textContent = "No he podido hacer la radiografía ahora mismo. Prueba en un minuto o escríbeme por WhatsApp al 692 02 47 35 y te la hago yo.";
    err.hidden = false;
  }

  // ---------- nota y resultado ----------
  function calcular(d) {
    var fallos = [], cortos = [], bien = [], nota = 0;
    if (!d) { // no tiene web
      fallos.push(FALLOS.sinWeb[0]); cortos.push(FALLOS.sinWeb[1]);
      return { nota: 0, fallos: fallos, cortos: cortos, bien: bien };
    }
    if (!d.ok) {
      fallos.push(FALLOS.noCarga[0]); cortos.push(FALLOS.noCarga[1]);
      return { nota: 0, fallos: fallos, cortos: cortos, bien: bien };
    }
    nota += PUNTOS.ok; bien.push(BIEN.ok);
    ORDEN.forEach(function (k) {
      if (d[k]) { nota += PUNTOS[k]; bien.push(BIEN[k]); }
      else { fallos.push(FALLOS[k][0]); cortos.push(FALLOS[k][1]); }
    });
    return { nota: nota, fallos: fallos, cortos: cortos, bien: bien };
  }

  function packRecomendado(nota, tieneWeb) {
    if (!tieneWeb || nota < 40) return "esencial";
    if (nota >= 70) return "completo";
    return "visible";
  }

  function mensajeWa() {
    var quiero = estado.cortos.length ? estado.cortos.join(", ") : "mejorarla todavía más";
    return "Hola, soy " + estado.nombre + ". Me he hecho la radiografía y tengo un " + estado.nota + "/100. Quiero arreglar: " + quiero + ". ¿Me ayudas?";
  }

  function resultado(d) {
    clearInterval(animarPasos.t);
    var r = calcular(d);
    estado.nota = r.nota; estado.fallos = r.fallos; estado.cortos = r.cortos;
    estado.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    var clase = r.nota < 40 ? "critico" : r.nota < 70 ? "mejorable" : "bien";
    var etiqueta = r.nota < 40 ? "Crítico: estás perdiendo clientes" : r.nota < 70 ? "Mejorable" : "Bien, pero hay margen";
    var res = $("#p-resultado");
    res.classList.remove("critico", "mejorable", "bien"); res.classList.add(clase);
    $("#n-res").textContent = estado.nombre;
    $("#t-res").textContent = etiqueta;

    $("#fallos").innerHTML = ""; $("#bien").innerHTML = "";
    r.fallos.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; $("#fallos").appendChild(li); });
    r.bien.forEach(function (t) { var li = document.createElement("li"); li.textContent = t; $("#bien").appendChild(li); });
    $("#b-fallos").hidden = !r.fallos.length;
    $("#b-bien").hidden = !r.bien.length;

    var reco = packRecomendado(r.nota, !!d);
    document.querySelectorAll(".pack").forEach(function (p) { p.classList.toggle("elegido", p.getAttribute("data-pack") === reco); });
    // el recomendado, el primero
    var packs = $("#packs"), elegido = packs.querySelector(".elegido");
    if (elegido) packs.insertBefore(elegido, packs.firstChild);

    var wa = "https://wa.me/" + TEL_IORITZ + "?text=" + encodeURIComponent(mensajeWa());
    $("#b-wa").href = wa; $("#b-wa2").href = wa;
    $("#b-calc").href = "../cuanto-pierdes/?n=" + encodeURIComponent(estado.nombre);

    mostrar("p-resultado");
    // nota animada
    var arco = $("#arco"), cifra = $("#cifra"), total = 326.7;
    arco.style.strokeDashoffset = total;
    requestAnimationFrame(function () { arco.style.strokeDashoffset = total * (1 - r.nota / 100); });
    var n = 0, paso = Math.max(1, Math.round(r.nota / 30));
    cifra.textContent = "0";
    clearInterval(resultado.t);
    resultado.t = setInterval(function () { n = Math.min(r.nota, n + paso); cifra.textContent = n; if (n >= r.nota) clearInterval(resultado.t); }, 30);

    guardar({ accion: "lead", id: estado.id, nombre: estado.nombre, tiene_web: !!d, url: estado.url, nota: r.nota, fallos: r.fallos.join(" | ") });
    radar("Radiografía: " + estado.nombre + " · " + r.nota + "/100", (d ? "Web: " + estado.url : "No tiene web") + "\n" + (r.cortos.join(", ") || "sin fallos") + "\nEstá en tu hoja de leads.", 4, "stethoscope");
  }

  // ---------- aviso al móvil de Ioritz (Radar, ntfy.sh). Los servidores de Google no llegan a ntfy, así que sale de aquí.
  //            En el móvil de Ioritz se silencia abriendo una vez /yo/. Con ?radar=test se fuerza para probar.
  var RADAR = "radar-iori-w55l9b611ksj13";
  try { if (location.hash === "#yo") localStorage.setItem("radar-off", "1"); } catch (e) {}
  function disp() { var u = navigator.userAgent; return /FBAN|FBAV|Instagram/.test(u) ? "navegador de Instagram/Facebook" : /iPhone|iPad/.test(u) ? "iPhone" : /Android/.test(u) ? "Android" : /Macintosh/.test(u) ? "Mac" : /Windows/.test(u) ? "PC" : "otro"; }
  function radar(titulo, cuerpo, prio, tag) {
    var prueba = /[?&]radar=test/.test(location.search);
    try { if (localStorage.getItem("radar-off") && !prueba) return; } catch (e) {}
    var u = "https://ntfy.sh/" + RADAR + "?title=" + encodeURIComponent((prueba ? "[PRUEBA] " : "") + titulo) +
      "&tags=" + encodeURIComponent(tag) + "&priority=" + prio + "&click=" + encodeURIComponent("https://ioritz13.github.io/radiografia/");
    var b = cuerpo + " (" + disp() + ") #radiografia";
    try { if (navigator.sendBeacon && navigator.sendBeacon(u, new Blob([b], { type: "text/plain" }))) return; } catch (e) {}
    try { fetch(u, { method: "POST", body: b, mode: "no-cors", keepalive: true }); } catch (e) {}
  }

  // ---------- leads (si falla, no pasa nada) ----------
  function guardar(datos) {
    if (!API_URL) return;
    var cuerpo = JSON.stringify(datos);
    try {
      // text/plain = petición «simple»: Apps Script la acepta sin preflight CORS
      if (navigator.sendBeacon && navigator.sendBeacon(API_URL, new Blob([cuerpo], { type: "text/plain;charset=utf-8" }))) return;
    } catch (e) {}
    try { fetch(API_URL, { method: "POST", body: cuerpo, headers: { "Content-Type": "text/plain;charset=utf-8" }, mode: "no-cors", keepalive: true }); } catch (e) {}
  }
  function clicWa() { if (estado.id && !clicWa.hecho) { clicWa.hecho = true; guardar({ accion: "clic", id: estado.id }); radar("🔥 " + estado.nombre + " quiere arreglar su web", "Ha pulsado «Lo arreglo · WhatsApp» con un " + estado.nota + "/100. Mira tu WhatsApp.", 5, "tada"); } }
  $("#b-wa").addEventListener("click", clicWa);
  $("#b-wa2").addEventListener("click", clicWa);

  // ---------- compartir y repetir ----------
  $("#b-compartir").addEventListener("click", function (e) {
    e.preventDefault();
    var url = location.origin + location.pathname;
    var texto = "Mira esto: en 30 segundos te dice cómo te ve Google y qué te hace perder clientes. Gratis: " + url;
    if (navigator.share) { navigator.share({ title: "Radiografía gratis en Google", text: texto, url: url }).catch(function () {}); return; }
    window.open("https://wa.me/?text=" + encodeURIComponent(texto), "_blank", "noopener");
  });
  $("#b-otra").addEventListener("click", function () {
    clicWa.hecho = false;
    estado = { nombre: "", tieneWeb: null, url: "", nota: 0, fallos: [], cortos: [], id: "" };
    $("#nombre").value = ""; $("#url").value = "";
    document.querySelectorAll(".opcion").forEach(function (x) { x.setAttribute("aria-checked", "false"); });
    $("#campo-url").hidden = true; $("#e-web").hidden = true;
    mostrar("p-inicio");
  });

  // ?n=Nombre para enlaces personalizados (por ejemplo, desde un mensaje): rellena el nombre
  try {
    var n0 = new URLSearchParams(location.search).get("n");
    if (n0) $("#nombre").value = n0.slice(0, 80);
  } catch (e) {}
})();
