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
  };

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
})();
