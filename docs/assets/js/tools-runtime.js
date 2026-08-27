/* Majid Tools: client-side utilities. Inputs remain in the current browser session. */
(function () {
  var language = document.documentElement.lang === "ar" ? "ar" : "en";
  var text = {
    copied: language === "ar" ? "تم النسخ" : "Copied",
    copyFailed: language === "ar" ? "تعذر النسخ؛ انسخ النتيجة يدوياً." : "Could not copy; please copy the result manually.",
    empty: language === "ar" ? "ألصق قيمة أولاً." : "Paste a value first.",
    jsonValid: language === "ar" ? "JSON صالح" : "Valid JSON",
    jsonInvalid: language === "ar" ? "JSON غير صالح" : "Invalid JSON",
    local: language === "ar" ? "الوقت المحلي" : "Local time",
    utc: language === "ar" ? "توقيت UTC" : "UTC time",
    seconds: language === "ar" ? "ثواني Unix" : "Unix seconds",
    milliseconds: language === "ar" ? "ميلي ثانية Unix" : "Unix milliseconds",
    jwtWarning: language === "ar" ? "هذه القراءة لا تتحقق من توقيع JWT أو موثوقيته." : "This reads a JWT; it does not validate its signature or trustworthiness.",
    expired: language === "ar" ? "منتهي" : "Expired",
    active: language === "ar" ? "نشط حسب exp" : "Active by exp",
    noExpiry: language === "ar" ? "لا يحتوي على exp" : "No exp claim",
    badToken: language === "ar" ? "تعذر قراءة الرمز. الصق JWT صالحاً بثلاثة أجزاء مفصولة بنقاط." : "Could not read this token. Paste a valid three-part JWT.",
    badDate: language === "ar" ? "أدخل طابع Unix أو تاريخ ISO صالحاً." : "Enter a valid Unix timestamp or ISO date.",
    badUrl: language === "ar" ? "أدخل رابطاً كاملاً يبدأ بـ https:// أو http://" : "Enter a complete URL beginning with https:// or http://",
    utmRequired: language === "ar" ? "أدخل رابط الصفحة واسم مصدر الحملة على الأقل." : "Enter at least the landing page URL and campaign source.",
    slugRequired: language === "ar" ? "أدخل عنواناً أو نصاً لإنشاء الرابط." : "Enter a title or text to create a slug.",
    slugReady: language === "ar" ? "تم إنشاء النتائج محلياً في متصفحك." : "Results were created locally in your browser.",
    emptySlug: language === "ar" ? "لم يتبق نص صالح لإنشاء رابط. جرّب حروفاً أو أرقاماً." : "No usable text remains for a slug. Try letters or numbers.",
  };

  function inputLengthBucket(value) {
    if (value.length <= 40) return "1_40";
    if (value.length <= 100) return "41_100";
    return "101_plus";
  }

  /* This does nothing until the owner intentionally adds an approved GA4 Google tag. Never pass visitor text, URLs, JWTs, or results here. */
  function trackToolEvent(name, parameters) {
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, Object.assign({ tool_id: document.body.dataset.tool, locale: language }, parameters || {}));
  }

  function setResult(node, value, state) {
    if (!node) return;
    node.textContent = value;
    node.classList.toggle("is-error", state === "error");
    node.classList.toggle("is-success", state === "success");
  }

  function copyFrom(source, feedback) {
    var value = source && (source.value || source.textContent);
    if (!value) return setResult(feedback, text.empty, "error");
    navigator.clipboard.writeText(value).then(function () { setResult(feedback, text.copied, "success"); }).catch(function () { setResult(feedback, text.copyFailed, "error"); });
  }

  document.querySelectorAll("[data-copy-source]").forEach(function (button) {
    button.addEventListener("click", function () { copyFrom(document.querySelector(button.dataset.copySource), document.querySelector(button.dataset.copyFeedback)); });
  });

  var tool = document.body.dataset.tool;
  if (tool === "json") {
    var jsonInput = document.getElementById("tool-input");
    var jsonResult = document.getElementById("tool-result");
    function processJson(mode) {
      if (!jsonInput.value.trim()) return setResult(jsonResult, text.empty, "error");
      try {
        var parsed = JSON.parse(jsonInput.value);
        setResult(jsonResult, mode === "minify" ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2), "success");
        document.getElementById("tool-status").textContent = text.jsonValid;
      } catch (error) {
        setResult(jsonResult, text.jsonInvalid + "\n" + error.message, "error");
        document.getElementById("tool-status").textContent = text.jsonInvalid;
      }
    }
    document.getElementById("format-json").addEventListener("click", function () { processJson("format"); });
    document.getElementById("minify-json").addEventListener("click", function () { processJson("minify"); });
    document.getElementById("sample-json").addEventListener("click", function () { jsonInput.value = '{"project":"Joobea","stack":["FastAPI","React"],"live":true}'; processJson("format"); });
  }

  if (tool === "jwt") {
    var jwtInput = document.getElementById("tool-input");
    var jwtResult = document.getElementById("tool-result");
    function decodePart(part) {
      var base64 = part.replace(/-/g, "+").replace(/_/g, "/");
      var binary = atob(base64 + "===".slice((base64.length + 3) % 4));
      var bytes = Uint8Array.from(binary, function (character) { return character.charCodeAt(0); });
      return JSON.parse(new TextDecoder().decode(bytes));
    }
    function decodeJwt() {
      if (!jwtInput.value.trim()) return setResult(jwtResult, text.empty, "error");
      try {
        var parts = jwtInput.value.trim().split(".");
        if (parts.length !== 3) throw new Error(text.badToken);
        var header = decodePart(parts[0]);
        var payload = decodePart(parts[1]);
        var expiry = text.noExpiry;
        if (typeof payload.exp === "number") expiry = new Date(payload.exp * 1000).toISOString() + " — " + (payload.exp * 1000 < Date.now() ? text.expired : text.active);
        setResult(jwtResult, "HEADER\n" + JSON.stringify(header, null, 2) + "\n\nPAYLOAD\n" + JSON.stringify(payload, null, 2) + "\n\nEXP\n" + expiry + "\n\n" + text.jwtWarning, "success");
      } catch (error) { setResult(jwtResult, text.badToken, "error"); }
    }
    document.getElementById("decode-jwt").addEventListener("click", decodeJwt);
    document.getElementById("sample-jwt").addEventListener("click", function () { jwtInput.value = "eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJkZW1vLXVzZXIiLCJyb2xlIjoicmVhZGVyIiwiZXhwIjoyMDUwMDAwMDAwfQ."; decodeJwt(); });
  }

  if (tool === "timestamp") {
    var timeInput = document.getElementById("tool-input");
    var timeResult = document.getElementById("tool-result");
    function convertTimestamp() {
      var raw = timeInput.value.trim();
      if (!raw) return setResult(timeResult, text.empty, "error");
      var date;
      if (/^-?\d+(\.\d+)?$/.test(raw)) {
        var number = Number(raw);
        date = new Date(Math.abs(number) < 100000000000 ? number * 1000 : number);
      } else date = new Date(raw);
      if (Number.isNaN(date.getTime())) return setResult(timeResult, text.badDate, "error");
      setResult(timeResult, text.local + "\n" + date.toLocaleString(language === "ar" ? "ar" : "en-GB") + "\n\n" + text.utc + "\n" + date.toISOString() + "\n\n" + text.seconds + "\n" + Math.floor(date.getTime() / 1000) + "\n\n" + text.milliseconds + "\n" + date.getTime(), "success");
    }
    document.getElementById("convert-time").addEventListener("click", convertTimestamp);
    document.getElementById("current-time").addEventListener("click", function () { timeInput.value = String(Date.now()); convertTimestamp(); });
  }

  if (tool === "utm") {
    var utmResult = document.getElementById("tool-result");
    function buildUtm() {
      var form = document.getElementById("utm-form");
      var urlValue = form.elements.url.value.trim();
      var source = form.elements.source.value.trim();
      if (!urlValue || !source) return setResult(utmResult, text.utmRequired, "error");
      try {
        var url = new URL(urlValue);
        [["source", "utm_source"], ["medium", "utm_medium"], ["campaign", "utm_campaign"], ["term", "utm_term"], ["content", "utm_content"]].forEach(function (pair) {
          var value = form.elements[pair[0]].value.trim();
          if (value) url.searchParams.set(pair[1], value);
        });
        setResult(utmResult, url.toString(), "success");
      } catch (error) { setResult(utmResult, text.badUrl, "error"); }
    }
    document.getElementById("build-utm").addEventListener("click", buildUtm);
    document.getElementById("sample-utm").addEventListener("click", function () {
      var form = document.getElementById("utm-form");
      form.elements.url.value = "https://example.com/product"; form.elements.source.value = "newsletter"; form.elements.medium.value = "email"; form.elements.campaign.value = "product_launch"; buildUtm();
    });
  }

  if (tool === "arabic-slug") {
    var slugInput = document.getElementById("tool-input");
    var slugResult = document.getElementById("tool-result");
    var slugStatus = document.getElementById("tool-status");
    var stripDiacritics = document.getElementById("strip-diacritics");
    var normalizeLetters = document.getElementById("normalize-letters");
    var includeLatin = document.getElementById("include-latin");
    var slugStarted = false;
    var diacritics = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
    var transliteration = { "ا": "a", "أ": "a", "إ": "i", "آ": "a", "ٱ": "a", "ب": "b", "ت": "t", "ث": "th", "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "ة": "h", "و": "w", "ؤ": "w", "ي": "y", "ى": "a", "ئ": "y" };

    function cleanArabic(value) {
      var cleaned = value.normalize("NFC").replace(/\u0640/g, "");
      if (stripDiacritics.checked) cleaned = cleaned.replace(diacritics, "");
      if (normalizeLetters.checked) cleaned = cleaned.replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي");
      return cleaned.replace(/[\t\n\r ]+/g, " ").replace(/[\u200E\u200F\u202A-\u202E]/g, "").trim();
    }

    function toArabicSlug(value) {
      return value.toLocaleLowerCase("ar").replace(/[^\p{L}\p{N}\u0600-\u06FF]+/gu, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
    }

    function toLatinSlug(value) {
      return Array.from(value).map(function (character) {
        if (character === "-") return "-";
        if (transliteration[character]) return transliteration[character];
        return /[a-z0-9]/i.test(character) ? character.toLowerCase() : "";
      }).join("").replace(/-+/g, "-").replace(/^-|-$/g, "");
    }

    function makeSlug() {
      if (!slugInput.value.trim()) return setResult(slugResult, text.slugRequired, "error");
      var cleaned = cleanArabic(slugInput.value);
      var arabicSlug = toArabicSlug(cleaned);
      if (!arabicSlug) {
        slugStatus.textContent = text.emptySlug;
        trackToolEvent("tool_error", { error_category: "empty_slug" });
        return setResult(slugResult, text.emptySlug, "error");
      }
      var output = (language === "ar" ? "النص المنظف" : "CLEANED TEXT") + "\n" + cleaned + "\n\n" + (language === "ar" ? "Slug عربي" : "ARABIC SLUG") + "\n" + arabicSlug + "\n\nURL-ENCODED\n" + encodeURIComponent(arabicSlug);
      if (includeLatin.checked) output += "\n\n" + (language === "ar" ? "Slug لاتيني اختياري" : "OPTIONAL LATIN SLUG") + "\n" + toLatinSlug(arabicSlug);
      setResult(slugResult, output, "success");
      slugStatus.textContent = text.slugReady;
      trackToolEvent("tool_complete", { input_length_bucket: inputLengthBucket(slugInput.value), result_type: includeLatin.checked ? "arabic_and_latin" : "arabic", normalization: normalizeLetters.checked ? "enabled" : "preserved", diacritics: stripDiacritics.checked ? "removed" : "preserved" });
    }

    slugInput.addEventListener("input", function () {
      if (slugStarted || !slugInput.value.trim()) return;
      slugStarted = true;
      trackToolEvent("tool_start", { input_length_bucket: inputLengthBucket(slugInput.value) });
    });
    document.getElementById("make-slug").addEventListener("click", makeSlug);
    document.getElementById("sample-slug").addEventListener("click", function () {
      slugInput.value = language === "ar" ? "كيف تبني واجهة عربية سهلة القراءة؟" : "How do you build an Arabic interface that is easy to read?";
      if (!slugStarted) { slugStarted = true; trackToolEvent("tool_start", { input_length_bucket: "1_40", entry_method: "sample" }); }
      makeSlug();
    });
  }

  document.addEventListener("click", function (event) {
    var projectCta = event.target.closest("[data-project-cta]");
    if (!projectCta) return;
    trackToolEvent("select_content", { content_type: "project_cta", item_id: projectCta.dataset.projectId, cta_position: projectCta.dataset.ctaPosition || "unknown" });
  });
})();
