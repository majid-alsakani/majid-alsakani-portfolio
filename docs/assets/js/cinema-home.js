/* Signal Noir: cinematic scroll choreography built from real portfolio evidence and accessibility-first fallbacks. */
(function () {
  var root = document.documentElement;
  var themeToggle = document.getElementById("theme");
  var storedTheme = localStorage.getItem("majid-theme");
  root.dataset.theme = storedTheme || "dark";

  if (themeToggle) {
    themeToggle.textContent = root.dataset.theme === "light" ? "☼" : "◐";
    themeToggle.addEventListener("click", function () {
      root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
      localStorage.setItem("majid-theme", root.dataset.theme);
      themeToggle.textContent = root.dataset.theme === "light" ? "☼" : "◐";
    });
  }

  document.querySelectorAll("#year").forEach(function (node) { node.textContent = new Date().getFullYear(); });

  var header = document.querySelector(".cine-topbar");
  var progress = document.querySelector(".cine-progress");
  function updateScroll() {
    var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    if (header) header.classList.toggle("is-condensed", window.scrollY > 24);
    if (progress) progress.style.transform = "scaleX(" + Math.min(1, window.scrollY / maxScroll) + ")";
  }
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });

  var menu = document.querySelector(".cine-menu");
  var nav = document.querySelector(".cine-nav");
  if (menu && nav) {
    menu.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      menu.setAttribute("aria-expanded", String(isOpen));
      menu.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        menu.setAttribute("aria-expanded", "false");
        menu.textContent = "☰";
      });
    });
  }

  var revealItems = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(function (item) { observer.observe(item); });
  } else { revealItems.forEach(function (item) { item.classList.add("in"); }); }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".cinematic-hero");
  var heroVisual = document.querySelector(".hero-portrait-wrap");
  var chapter = document.querySelector(".cine-scroll-chapter");
  var stage = document.querySelector(".cine-scroll-stage");
  var scenes = Array.prototype.slice.call(document.querySelectorAll(".cine-scene"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".cine-scene-dots i"));
  var frameLabel = document.querySelector("[data-scene-frame]");
  var activeScene = -1;
  var ticking = false;

  function setScene(index) {
    if (index === activeScene) return;
    activeScene = index;
    scenes.forEach(function (scene, sceneIndex) { scene.classList.toggle("is-active", sceneIndex === index); });
    dots.forEach(function (dot, dotIndex) { dot.classList.toggle("is-active", dotIndex === index); });
    if (frameLabel) frameLabel.textContent = "0" + (index + 1);
  }

  function updateCinematicScroll() {
    ticking = false;
    if (heroVisual && !reduceMotion) {
      var heroPosition = hero ? hero.getBoundingClientRect() : { top: 0 };
      var tilt = Math.max(-8, Math.min(8, heroPosition.top * -.018));
      heroVisual.style.setProperty("--hero-tilt", tilt.toFixed(2));
      heroVisual.style.setProperty("--page-y", String(Math.max(-500, Math.min(500, heroPosition.top))));
    }
    if (!chapter || !stage || !scenes.length || window.innerWidth <= 960 || reduceMotion) return;
    var rect = chapter.getBoundingClientRect();
    var travel = Math.max(1, rect.height - window.innerHeight);
    var progress = Math.max(0, Math.min(0.9999, -rect.top / travel));
    var scenePosition = progress * scenes.length;
    var index = Math.min(scenes.length - 1, Math.floor(scenePosition));
    stage.style.setProperty("--chapter-progress", String(scenePosition - index));
    setScene(index);
  }

  setScene(0);
  updateCinematicScroll();
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateCinematicScroll); }
  }, { passive: true });
  window.addEventListener("resize", updateCinematicScroll);
})();
