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

  var projectIndex = document.getElementById("projects");
  if (projectIndex) {
    var isArabic = root.lang === "ar";
    var updates = document.createElement("aside");
    updates.className = "project-updates";
    updates.setAttribute("data-reveal", "");
    updates.setAttribute("aria-label", isArabic ? "آخر التحديثات المرتبطة بالمشاريع" : "Latest project updates");
    updates.innerHTML = isArabic
      ? '<p class="project-updates-kicker">من سجل البناء</p><h3>آخر<br/><em>التحديثات.</em></h3><p class="project-updates-intro">مقالات حديثة عن الأنظمة والمنتجات التي تقف خلف ملفات الدليل.</p><div class="project-update-list"><a href="/majid-alsakani-portfolio/articles/planner-executor-critic-ai-architecture.html"><span>أنظمة AI · 25 أغسطس 2026</span><strong>Planner–Executor–Critic: معمارية عملية لأنظمة الذكاء الاصطناعي الموثوقة</strong><i aria-hidden="true">↗</i></a><a href="/majid-alsakani-portfolio/articles/developer-roadmap-arabic.html"><span>بناء تحت القيود · 30 مايو 2026</span><strong>تصميم خارطة طريق ثنائية اللغة للمطورين</strong><i aria-hidden="true">↗</i></a><a href="/majid-alsakani-portfolio/articles/fastapi-django-react-production-stack.html"><span>هندسة الإنتاج · 22 أبريل 2026</span><strong>مكدس الإنتاج لدي: FastAPI وDjango وReact</strong><i aria-hidden="true">↗</i></a></div><a class="project-updates-all" href="/majid-alsakani-portfolio/ar/blog.html">كل المقالات <span aria-hidden="true">↗</span></a><a class="project-updates-archive" href="/majid-alsakani-portfolio/ar/projects/">دليل المشاريع القابل للفهرسة <span aria-hidden="true">↗</span></a>'
      : '<p class="project-updates-kicker">From the build log</p><h3>Latest<br/><em>updates.</em></h3><p class="project-updates-intro">Recent writing on the systems and products behind the evidence files.</p><div class="project-update-list"><a href="/majid-alsakani-portfolio/articles/planner-executor-critic-ai-architecture.html"><span>AI systems · 25 Aug 2026</span><strong>Planner–Executor–Critic: A practical architecture for reliable AI systems</strong><i aria-hidden="true">↗</i></a><a href="/majid-alsakani-portfolio/articles/developer-roadmap-arabic.html"><span>Building under constraints · 30 May 2026</span><strong>Designing a bilingual developer roadmap</strong><i aria-hidden="true">↗</i></a><a href="/majid-alsakani-portfolio/articles/fastapi-django-react-production-stack.html"><span>Production engineering · 22 Apr 2026</span><strong>My production stack: FastAPI, Django and React</strong><i aria-hidden="true">↗</i></a></div><a class="project-updates-all" href="/majid-alsakani-portfolio/blog.html">Read all writing <span aria-hidden="true">↗</span></a><a class="project-updates-archive" href="/majid-alsakani-portfolio/projects/">Searchable project archive <span aria-hidden="true">↗</span></a>';

    var directory = projectIndex.querySelector(".project-directory");
    if (directory && directory.parentNode) {
      var layout = document.createElement("div");
      layout.className = "project-directory-and-updates";
      directory.parentNode.insertBefore(layout, directory);
      layout.appendChild(directory);
      layout.appendChild(updates);
    } else {
      projectIndex.appendChild(updates);
    }
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

  var soundToggle = document.querySelector("[data-signal-audio]");
  var transitionSound = document.querySelector("[data-signal-transition]");
  if (soundToggle && transitionSound) {
    transitionSound.volume = 0.18;
    var soundOnText = root.lang === "ar" ? "الصوت يعمل" : "Sound on";
    var soundOffText = root.lang === "ar" ? "الصوت متوقف" : "Sound off";
    soundToggle.addEventListener("click", function () {
      if (transitionSound.paused) {
        transitionSound.currentTime = 0;
        transitionSound.play().then(function () {
          soundToggle.classList.add("is-active");
          soundToggle.setAttribute("aria-pressed", "true");
          var label = soundToggle.querySelector("span");
          if (label) label.textContent = soundOnText;
        }).catch(function () {});
      } else {
        transitionSound.pause();
        transitionSound.currentTime = 0;
        soundToggle.classList.remove("is-active");
        soundToggle.setAttribute("aria-pressed", "false");
        var inactiveLabel = soundToggle.querySelector("span");
        if (inactiveLabel) inactiveLabel.textContent = soundOffText;
      }
    });
    transitionSound.addEventListener("ended", function () {
      soundToggle.classList.remove("is-active");
      soundToggle.setAttribute("aria-pressed", "false");
      var label = soundToggle.querySelector("span");
      if (label) label.textContent = soundOffText;
    });
  }

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
  var projectAnchorTimer = 0;

  function settleProjectAnchor() {
    if (window.location.hash !== "#projects") return;
    var target = document.getElementById("projects");
    if (!target) return;
    target.querySelectorAll("[data-reveal]").forEach(function (item) { item.classList.add("in"); });
    root.classList.add("is-settling-project-anchor");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        var headerOffset = header ? header.getBoundingClientRect().height : 0;
        var targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" });
        window.clearTimeout(projectAnchorTimer);
        projectAnchorTimer = window.setTimeout(function () { root.classList.remove("is-settling-project-anchor"); }, 140);
      });
    });
  }

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
  window.addEventListener("hashchange", settleProjectAnchor);
  settleProjectAnchor();
  window.addEventListener("load", function () { window.setTimeout(settleProjectAnchor, 120); }, { once: true });
  window.setTimeout(settleProjectAnchor, 700);
})();
