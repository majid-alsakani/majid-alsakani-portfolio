/* Evidence in Motion interactions: deliberate motion, accessibility-first fallbacks, no external dependencies. */
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
})();
