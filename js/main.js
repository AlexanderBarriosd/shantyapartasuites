/* Shanty Apartasuites - main.js */
(function () {
  "use strict";

  /* ==========================================================
     Configuración de analítica
     GTM_KNBN2Z88: contenedor de Google Tag Manager del sitio
     GA4_ID: opcional. Déjalo vacío si configuras GA4 dentro de
     GTM (recomendado) para no duplicar eventos.
     ========================================================== */
  var GTM_ID = "GTM-KNBN2Z88";
  var GA4_ID = "";

  // Consentimiento por defecto: todo denegado hasta que el visitante
  // interactúa. Coincide con el modo de consentimiento de la versión
  // anterior del sitio y evita carga de analítica sin permiso.
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality: "denied",
    personalization: "denied",
    security_storage: "denied",
    wait_for_update: 500
  });

  if (GA4_ID) {
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + GA4_ID;
    document.head.appendChild(gaScript);
    window.gtag("js", new Date());
    window.gtag("config", GA4_ID);
  }

  (function loadGtm() {
    if (!GTM_ID) return;
    window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=" + GTM_ID;
    document.head.appendChild(s);
    var n = document.createElement("noscript");
    n.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' +
      GTM_ID + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>';
    document.body.insertBefore(n, document.body.firstChild);
  })();

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /* ---------------- Año en el footer ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- Menú móvil ---------------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  function setMenu(open) {
    if (!toggle || !nav) return;
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Cerrar al navegar dentro del menú
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });

    // Cerrar con Escape y devolver el foco al botón
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      setMenu(false);
      toggle.focus();
    });

    // Cerrar al pulsar fuera del menú
    document.addEventListener("click", function (e) {
      if (toggle.getAttribute("aria-expanded") !== "true") return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      setMenu(false);
    });

    // Al volver a escritorio, resets el estado
    const desktop = window.matchMedia("(min-width: 961px)");
    const onDesktop = (ev) => { if (ev.matches) setMenu(false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onDesktop);
    else if (desktop.addListener) desktop.addListener(onDesktop);
  }

  /* ---------------- Sombra del header al hacer scroll ---------------- */
  const header = document.querySelector(".site-header");
  if (header) {
    const onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 10); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Reveal al hacer scroll ---------------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("in-view"); });
    } else {
      const io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in-view");
          io.unobserve(en.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.querySelector(".lightbox");
  let currentImages = [];
  let currentIndex = 0;
  let lastFocused = null;

  function lbImage() { return lightbox ? lightbox.querySelector(".lb-img") : null; }

  function showImage() {
    if (!lightbox || !currentImages.length) return;
    const target = currentImages[currentIndex];
    const img = lbImage();
    if (!img) return;
    img.src = target.currentSrc || target.src;
    img.alt = target.alt || "";
    const count = lightbox.querySelector(".lb-count");
    if (count) count.textContent = (currentIndex + 1) + " / " + currentImages.length;
  }

  function step(dir) {
    if (!currentImages.length) return;
    currentIndex = (currentIndex + dir + currentImages.length) % currentImages.length;
    showImage();
  }

  function openLightbox(gallery, img) {
    if (!lightbox) return;
    currentImages = Array.from(gallery.querySelectorAll("img"));
    currentIndex = Math.max(0, currentImages.indexOf(img));
    lastFocused = document.activeElement;
    showImage();
    lightbox.classList.add("open");
    lightbox.removeAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    const close = lightbox.querySelector(".lb-close");
    if (close) close.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains("open")) return;
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    // No se quita el src: un <img> sin src no es HTML válido. El lightbox
    // está en display:none, así que no se ve ni se descarga nada nuevo.
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
    lastFocused = null;
  }

  if (lightbox) {
    lightbox.setAttribute("aria-hidden", "true");

    // El <img> del visor se crea aqui: dejarlo en el HTML produciria un
    // <img> sin src, que no es HTML valido, y un src="" haria una peticion
    // a la URL de la propia pagina.
    if (!lbImage()) {
      const lbImg = document.createElement("img");
      lbImg.className = "lb-img";
      lbImg.alt = "";
      lightbox.insertBefore(lbImg, lightbox.querySelector(".lb-next"));
    }

    const counter = lightbox.querySelector(".lb-count");
    if (counter) counter.setAttribute("aria-live", "polite");

    // Cada imagen de galería se comporta como un botón real
    document.querySelectorAll(".gallery").forEach(function (gallery) {
      gallery.querySelectorAll("img").forEach(function (img) {
        img.setAttribute("role", "button");
        img.setAttribute("tabindex", "0");
        img.setAttribute("aria-haspopup", "dialog");
        img.setAttribute("aria-label", (img.alt || "Foto") + " - ampliar");

        img.addEventListener("click", function () { openLightbox(gallery, img); });
        img.addEventListener("keydown", function (e) {
          if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
          e.preventDefault();
          openLightbox(gallery, img);
        });
      });
    });

    const closeBtn = lightbox.querySelector(".lb-close");
    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    const prevBtn = lightbox.querySelector(".lb-prev");
    if (prevBtn) prevBtn.addEventListener("click", function () { step(-1); });
    const nextBtn = lightbox.querySelector(".lb-next");
    if (nextBtn) nextBtn.addEventListener("click", function () { step(1); });

    lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });

    // Foco atrapado dentro del lightbox mientras está abierto
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;

      if (e.key === "Escape") { closeLightbox(); return; }
      if (e.key === "ArrowLeft") { step(-1); return; }
      if (e.key === "ArrowRight") { step(1); return; }
      if (e.key !== "Tab") return;

      const items = Array.from(lightbox.querySelectorAll(FOCUSABLE))
        .filter(function (el) { return el.offsetParent !== null; });
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------------- Formularios -> WhatsApp ---------------- */
  const FIELD_LABELS = {
    nombre: "Nombre",
    suite: "Apartamento",
    llegada: "Llegada",
    salida: "Salida",
    adultos: "Adultos",
    ninos: "Niños",
    asunto: "Motivo",
    mensaje: "Mensaje"
  };

  function legible(iso) {
    const d = new Date(iso + "T00:00:00");
    if (isNaN(d)) return iso;
    return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
  }

  // Las fechas no pueden ser pasadas a la fecha de hoy
  const today = new Date().toISOString().slice(0, 10);
  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    input.setAttribute("min", today);
  });

  document.querySelectorAll(".booking-form").forEach(function (form) {
    // La salida no puede ser anterior a la llegada
    const llegada = form.querySelector('[name="llegada"]');
    const salida = form.querySelector('[name="salida"]');
    if (llegada && salida) {
      llegada.addEventListener("change", function () {
        salida.min = llegada.value || today;
        if (salida.value && llegada.value && salida.value < llegada.value) salida.value = llegada.value;
      });
    }

    form.addEventListener("submit", function (e) {
      // Valida con la API nativa para poder mostrar el error junto al campo
      if (!form.checkValidity()) {
        e.preventDefault();
        form.reportValidity();
        return;
      }
      e.preventDefault();

      const fd = new FormData(form);
      const lines = ["Hola, quiero información en Shanty Apartasuites"];
      if (fd.get("suite")) lines[0] = "Hola, quiero reservar en Shanty Apartasuites";

      for (const field in FIELD_LABELS) {
        const value = fd.get(field);
        if (!value) continue;
        lines.push("- " + FIELD_LABELS[field] + ": " +
          (field === "llegada" || field === "salida" ? legible(String(value)) : value));
      }

      window.open(
        "https://wa.me/573332679121?text=" + encodeURIComponent(lines.join("\n")),
        "_blank", "noopener"
      );

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        // Guardar el icono para no destruirlo al cambiar el texto
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.setAttribute("aria-busy", "true");
        btn.textContent = "Abriendo WhatsApp...";
        setTimeout(function () {
          btn.innerHTML = original;
          btn.disabled = false;
          btn.removeAttribute("aria-busy");
          form.reset();
        }, 2000);
      }
    });
  });
})();
