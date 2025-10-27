// static/js/footer-logos.js
document.addEventListener("DOMContentLoaded", function () {
  if (window.__footerLogosInit) return;
  window.__footerLogosInit = true;

  var rail = document.querySelector(".site-footer .footer-logos");
  if (!rail) return;

  // Espera a que todos los <img> del rail tengan tamaño (>0)
  function waitImagesLoaded(imgs, cb) {
    var tries = 0;
    function ready() {
      return imgs.every(function (img) {
        return (img.complete && img.naturalWidth > 0) || img.getBoundingClientRect().width > 0;
      });
    }
    function tick() {
      if (ready() || tries > 60) return cb(); // 60*100ms = 6s máx
      tries++; setTimeout(tick, 100);
    }
    // por si ya están cacheadas
    tick();
    // además, si alguna termina de cargar antes, aceleramos
    imgs.forEach(function (img) { img.addEventListener("load", function(){ if (ready()) cb(); }, {once:true}); });
  }

  function init() {
    // crear track si no existe
    var track = rail.querySelector(".logo-track");
    if (!track) {
      track = document.createElement("div");
      track.className = "logo-track";
      var imgs = Array.from(rail.querySelectorAll("img"));
      imgs.forEach(function (img) { track.appendChild(img); });
      rail.innerHTML = "";
      rail.appendChild(track);
    }

    var base = Array.from(track.children);
    if (!base.length) return;

    // Medidas
    function width(el){ return el.getBoundingClientRect().width; }
    function gapValue() {
      var st = getComputedStyle(track);
      return parseFloat(st.gap || st.columnGap || "0");
    }
    function setWidth(items){
      // suma de anchos + gaps entre ellos
      return items.reduce(function (w, n) { return w + width(n); }, 0) + gapValue() * (items.length - 1);
    }

    // Espera real a que los logos tengan ancho > 0
    waitImagesLoaded(base, function start() {
      // Rellena clonando el SET completo hasta que haya suficiente cola
      function fill() {
        var minWidth = rail.clientWidth * 2.2; // largo para que no veas un logo duplicado a la vez
        var guard = 0;
        while (track.scrollWidth < minWidth && guard < 8) {
          base.forEach(function (n) { track.appendChild(n.cloneNode(true)); });
          guard++;
        }
      }
      fill();

      var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      var SPEED = 28; // px/s
      var offset = 0, paused = false, last = null;

      var oneSet = setWidth(base);                 // ancho real del set base
      if (!oneSet || !isFinite(oneSet)) return;    // seguridad

      rail.addEventListener("mouseenter", function(){ paused = true; });
      rail.addEventListener("mouseleave", function(){ paused = false; });
      document.addEventListener("visibilitychange", function(){ paused = document.hidden; });

      var rez;
      window.addEventListener("resize", function(){
        clearTimeout(rez);
        rez = setTimeout(function(){
          // Recalcular límites tras resize
          oneSet = setWidth(base);
          fill();
          // Mantener offset en rango
          offset = offset % oneSet;
          track.style.transform = "translate3d(" + (-offset) + "px,0,0)";
        }, 120);
      });

      function step(ts){
        if (last == null) last = ts;
        var dt = (ts - last) / 1000; last = ts;
        if (!paused) {
          offset += SPEED * dt;
          if (offset >= oneSet) offset -= oneSet;  // wrap EXACTO al terminar un set
          track.style.transform = "translate3d(" + (-offset) + "px,0,0)";
        }
        requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  init();
});