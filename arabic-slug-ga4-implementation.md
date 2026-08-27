# Arabic Slug & Text Cleaner — الكلمات والكود وقياس GA4

## الكلمات الدقيقة للصفحة

لا تُستخدم هذه العبارات معاً كحشو في العنوان أو الوصف. تختار كل صفحة عبارة نية رئيسية واحدة، ثم تذكر العبارات المساندة بصورة طبيعية في الشرح وFAQ. لا يوجد في بيانات البحث المتاحة ما يثبت حجم بحث محدداً لهذه العبارات؛ هذه صيغ تطابق نية المستخدم التي تظهر لدى أدوات ومكتبات تؤدي المهمة نفسها [1] [2] [3].

| موضع الصفحة | النص العربي الدقيق | الغرض |
|---|---|---|
| عنوان الصفحة | `منشئ Slug عربي ومنظف نص عربي مجاناً | أدوات ماجد` | العبارة الرئيسية + الوعد الواضح |
| الوصف | `نظّف العنوان العربي وأنشئ slug صالحاً للرابط ونسخة URL-encoded في متصفحك فقط. بلا حساب وبلا إرسال للنص إلى خادم.` | يوضح المهمة والخصوصية |
| H1 | `منشئ Slug عربي ومنظف نص` | يطابق نية البحث مباشرة |
| العبارة الأساسية | `منشئ slug عربي` | تستخدم في المقدمة وFAQ مرة أو مرتين |
| عبارة مساندة 1 | `تحويل عنوان عربي إلى رابط` | تشرح النتيجة المرغوبة |
| عبارة مساندة 2 | `تنظيف النص العربي` | تشرح خطوة المعالجة |
| عبارة مساندة 3 | `تحويل النص العربي إلى URL` | تشرح النسخة المرمزة |
| النسخة الإنجليزية | `Arabic Slug Generator & Text Cleaner` | عنوان صفحة البديل الإنجليزي |

> لا تعد الصفحة بتحسين الترتيب. فائدتها هي إنتاج اسم مسار واضح وقابل للنسخ؛ قرار الترتيب في Google يعتمد على عوامل عديدة ولا تضمنه الأداة أو slug وحده.

## هيكل الصفحة المقترح

يوضع هذا داخل `docs/ar/tools/arabic-slug-text-cleaner/index.html`. جميع عمليات التنظيف والتحويل تقع داخل المتصفح؛ لذلك لا يوضع النص أو الناتج في طلب شبكي أو في معاملات GA4.

```html
<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>منشئ Slug عربي ومنظف نص عربي مجاناً | أدوات ماجد</title>
  <meta name="description" content="نظّف العنوان العربي وأنشئ slug صالحاً للرابط ونسخة URL-encoded في متصفحك فقط. بلا حساب وبلا إرسال للنص إلى خادم.">
  <link rel="canonical" href="https://majid-alsakani.github.io/majid-alsakani-portfolio/ar/tools/arabic-slug-text-cleaner/">
  <link rel="alternate" hreflang="ar" href="https://majid-alsakani.github.io/majid-alsakani-portfolio/ar/tools/arabic-slug-text-cleaner/">
  <link rel="alternate" hreflang="en" href="https://majid-alsakani.github.io/majid-alsakani-portfolio/tools/arabic-slug-text-cleaner/">
  <link rel="alternate" hreflang="x-default" href="https://majid-alsakani.github.io/majid-alsakani-portfolio/tools/arabic-slug-text-cleaner/">
  <link rel="stylesheet" href="/majid-alsakani-portfolio/assets/css/tools-hub.css">
  <!-- ضع Google tag هنا فقط بعد موافقة المالك وتفعيل قياس GA4. -->
</head>
<body class="cinema-home tool-page" data-tool="arabic-slug-text-cleaner">
  <main class="tool-main">
    <p class="tool-kicker">أداة نصوص عربية / 05</p>
    <h1>منشئ Slug عربي<br><em>ومنظف نص.</em></h1>
    <p class="tool-privacy"><strong>داخل المتصفح:</strong> النص الذي تدخله والـslug الناتج لا يُرسلان إلى خادم ولا يُضافان إلى التحليلات.</p>

    <section class="tool-workspace" aria-label="Arabic Slug and Text Cleaner">
      <label for="arabic-source">العنوان أو النص</label>
      <textarea id="arabic-source" rows="6" placeholder="مثال: كيف تبني واجهة عربية سهلة القراءة؟"></textarea>

      <fieldset class="tool-options">
        <legend>خيارات التنظيف</legend>
        <label><input id="remove-diacritics" type="checkbox"> إزالة التشكيل</label>
        <label><input id="normalize-letters" type="checkbox"> تطبيع أ، إ، آ إلى ا وى إلى ي</label>
        <label><input id="latin-slug" type="checkbox"> أنشئ نسخة لاتينية اختيارية</label>
      </fieldset>

      <div class="tool-actions">
        <button id="clean-arabic" type="button">نظّف وأنشئ الرابط</button>
        <button id="sample-arabic" type="button">استخدم مثالاً</button>
      </div>

      <p id="arabic-status" class="tool-status" aria-live="polite">الصق عنواناً عربياً لبدء العمل.</p>
      <div class="tool-results" aria-label="النتائج">
        <label for="cleaned-text">النص المنظف</label>
        <output id="cleaned-text"></output><button type="button" data-copy-output="cleaned-text">انسخ النص</button>
        <label for="arabic-slug">Slug عربي</label>
        <output id="arabic-slug"></output><button type="button" data-copy-output="arabic-slug">انسخ slug</button>
        <label for="encoded-slug">نسخة URL-encoded</label>
        <output id="encoded-slug"></output><button type="button" data-copy-output="encoded-slug">انسخ النسخة المرمزة</button>
        <div id="latin-result" hidden>
          <label for="latin-output">Slug لاتيني اختياري</label>
          <output id="latin-output"></output><button type="button" data-copy-output="latin-output">انسخ النسخة اللاتينية</button>
        </div>
      </div>
    </section>

    <aside class="tool-project-bridge">
      <p>من الأداة إلى الدليل</p>
      <h2>شاهد كيف اختبرت جودة واجهات RTL في Qalam.</h2>
      <a href="/majid-alsakani-portfolio/ar/case-studies/qalam-arabic-interface-qa.html"
         data-project-cta data-project-id="qalam-arabic-interface-qa" data-cta-position="after_result">
         افتح ملف الدليل ↗
      </a>
    </aside>
  </main>
  <script src="/majid-alsakani-portfolio/assets/js/ga4-tools-events.js"></script>
  <script src="/majid-alsakani-portfolio/assets/js/arabic-slug-cleaner.js"></script>
</body>
</html>
```

## JavaScript المحلي للأداة

يوضع في `docs/assets/js/arabic-slug-cleaner.js`. المنظف لا يترجم النص ولا يدعي أن هناك معياراً وحيداً لتحويل العربية إلى اللاتينية. يبقى التنظيف الافتراضي محافظاً، بينما يمنح المستخدم تطبيع الحروف وإزالة التشكيل كخيارات صريحة.

```js
(() => {
  const toolId = "arabic_slug_text_cleaner";
  const source = document.querySelector("#arabic-source");
  const removeDiacritics = document.querySelector("#remove-diacritics");
  const normalizeLetters = document.querySelector("#normalize-letters");
  const includeLatin = document.querySelector("#latin-slug");
  const status = document.querySelector("#arabic-status");
  const outputs = {
    cleaned: document.querySelector("#cleaned-text"),
    slug: document.querySelector("#arabic-slug"),
    encoded: document.querySelector("#encoded-slug"),
    latin: document.querySelector("#latin-output"),
  };
  const latinResult = document.querySelector("#latin-result");
  let started = false;
  let completed = false;

  // تشمل التشكيل وعلامات التلاوة؛ لا تُستخدم إلا عندما يختارها المستخدم.
  const diacritics = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;
  const transliteration = {
    "ا": "a", "أ": "a", "إ": "i", "آ": "a", "ٱ": "a", "ب": "b", "ت": "t", "ث": "th",
    "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh", "ر": "r", "ز": "z", "س": "s",
    "ش": "sh", "ص": "s", "ض": "d", "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f",
    "ق": "q", "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "ة": "h", "و": "w",
    "ؤ": "w", "ي": "y", "ى": "a", "ئ": "y",
  };

  function inputLengthBucket(value) {
    if (value.length === 0) return "empty";
    if (value.length <= 40) return "1_40";
    if (value.length <= 100) return "41_100";
    return "101_plus";
  }

  function cleanArabicText(value, options) {
    let cleaned = value.normalize("NFC").replace(/\u0640/g, ""); // إزالة التطويل
    if (options.removeDiacritics) cleaned = cleaned.replace(diacritics, "");
    if (options.normalizeLetters) {
      cleaned = cleaned
        .replace(/[أإآٱ]/g, "ا")
        .replace(/ى/g, "ي");
    }
    return cleaned
      .replace(/[\t\n\r ]+/g, " ")
      .replace(/[\u200E\u200F\u202A-\u202E]/g, "") // علامات اتجاه مخفية
      .trim();
  }

  function toArabicSlug(value) {
    return value
      .toLocaleLowerCase("ar")
      .replace(/[^\p{L}\p{N}\u0600-\u06FF]+/gu, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function toLatinSlug(value) {
    return [...value]
      .map((character) => {
        if (character === "-") return "-";
        if (transliteration[character]) return transliteration[character];
        return /[a-z0-9]/i.test(character) ? character.toLowerCase() : "";
      })
      .join("")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  function track(name, parameters = {}) {
    // لا تمرر source.value أو slug أو encoded slug أو أي نص مستخدم إلى GA4.
    if (typeof window.gtag !== "function") return;
    window.gtag("event", name, {
      tool_id: toolId,
      locale: document.documentElement.lang || "ar",
      ...parameters,
    });
  }

  function render() {
    const rawValue = source.value;
    if (!rawValue.trim()) {
      status.textContent = "أدخل عنواناً أو نصاً أولاً.";
      return;
    }
    const options = {
      removeDiacritics: removeDiacritics.checked,
      normalizeLetters: normalizeLetters.checked,
    };
    const cleaned = cleanArabicText(rawValue, options);
    const slug = toArabicSlug(cleaned);
    if (!slug) {
      status.textContent = "لم يتبق نص صالح لتكوين رابط. جرّب عنواناً يحوي حروفاً أو أرقاماً.";
      track("tool_error", { error_category: "empty_slug" });
      return;
    }
    outputs.cleaned.textContent = cleaned;
    outputs.slug.textContent = slug;
    outputs.encoded.textContent = encodeURIComponent(slug);
    latinResult.hidden = !includeLatin.checked;
    outputs.latin.textContent = includeLatin.checked ? toLatinSlug(slug) : "";
    status.textContent = "تم إنشاء النتائج محلياً في متصفحك.";
    completed = true;
    track("tool_complete", {
      result_type: includeLatin.checked ? "arabic_and_latin" : "arabic",
      options: [removeDiacritics.checked && "no_diacritics", normalizeLetters.checked && "normalized"].filter(Boolean).join("_") || "preserved",
    });
  }

  source.addEventListener("input", () => {
    if (started || !source.value.trim()) return;
    started = true;
    track("tool_start", { input_length_bucket: inputLengthBucket(source.value) });
  });

  document.querySelector("#clean-arabic").addEventListener("click", render);
  document.querySelector("#sample-arabic").addEventListener("click", () => {
    source.value = "كيف تبني واجهة عربية سهلة القراءة؟";
    source.focus();
    if (!started) {
      started = true;
      track("tool_start", { input_length_bucket: "1_40", entry_method: "sample" });
    }
    render();
  });

  document.addEventListener("click", async (event) => {
    const copyButton = event.target.closest("[data-copy-output]");
    if (!copyButton) return;
    const output = document.querySelector(`#${copyButton.dataset.copyOutput}`);
    const text = output?.textContent?.trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      status.textContent = "تم النسخ.";
      track("tool_copy", { output_kind: copyButton.dataset.copyOutput });
    } catch {
      status.textContent = "تعذّر النسخ التلقائي؛ انسخ النتيجة يدوياً.";
      track("tool_error", { error_category: "copy_unavailable" });
    }
  });
})();
```

## Google tag وملف أحداث GA4

ينشئ المالك Property وWeb data stream في GA4 ثم يستبدل `G-XXXXXXXXXX` بالـMeasurement ID الفعلي. لا تُنشر القيمة التجريبية. يوضع الوسم مرة واحدة في `<head>` في كل صفحة قابلة للقياس، قبل أي ملف يحاول استخدام `gtag()`. توضح Google أن الأحداث المخصصة تستخدم `gtag('event', event_name, parameters)` وأنها يجب أن تكون أسفل Google tag [4].

```html
<!-- Google tag (gtag.js): أضفه بعد موافقة المالك على القياس والخصوصية. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

يوضع الملف التالي في `docs/assets/js/ga4-tools-events.js`. يفعّل الوسم وأحداثه فقط بعد أن يختار المالك آلية الموافقة وسياسة الخصوصية المناسبة لجمهوره. الهدف هو قياس رابط الجسر فقط؛ لا يتتبع محتوى أي حقل ولا يعطل Ctrl/Cmd-click أو النقر الأوسط.

```js
(() => {
  const toolId = document.body.dataset.tool;
  if (!toolId) return;

  function sendProjectClick(link, done) {
    if (typeof window.gtag !== "function") {
      done();
      return;
    }
    let navigated = false;
    const navigate = () => {
      if (navigated) return;
      navigated = true;
      done();
    };
    window.gtag("event", "select_content", {
      content_type: "project_cta",
      item_id: link.dataset.projectId,
      tool_id: toolId,
      locale: document.documentElement.lang || "ar",
      cta_position: link.dataset.ctaPosition || "unknown",
      event_callback: navigate,
      event_timeout: 800,
    });
    window.setTimeout(navigate, 900);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-project-cta]");
    if (!link || !link.href) return;
    // لا نعطل السلوك الطبيعي عند فتح الرابط في تبويب/نافذة أخرى.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      if (typeof window.gtag === "function") {
        window.gtag("event", "select_content", {
          content_type: "project_cta", item_id: link.dataset.projectId, tool_id: toolId,
          locale: document.documentElement.lang || "ar", cta_position: link.dataset.ctaPosition || "unknown",
        });
      }
      return;
    }
    event.preventDefault();
    sendProjectClick(link, () => { window.location.assign(link.href); });
  });
})();
```

## إعداد GA4 خطوة بخطوة

| الخطوة | الإجراء الدقيق | التحقق |
|---|---|---|
| 1 | أنشئ GA4 Property ثم Web data stream للموقع. | يظهر Measurement ID على هيئة `G-...` |
| 2 | أضف Google tag أعلاه إلى الصفحات المشتركة، أو حمّله من ملف مشترك قبل أدوات القياس. | يظهر `page_view` في Realtime |
| 3 | أضف `ga4-tools-events.js` ثم JavaScript الأداة. | لا توجد أخطاء Console |
| 4 | من **Admin → Custom definitions**، أنشئ Event-scoped dimensions للمعاملات: `tool_id`، `locale`، `input_length_bucket`، `result_type`، `output_kind`، `error_category`، `item_id`، و`cta_position`. | تظهر الأبعاد في الاستكشافات بعد وصول بيانات جديدة |
| 5 | اختبر الأداة عبر DebugView أو Realtime مع تفعيل وضع التشخيص. | تسلسل `tool_start → tool_complete → tool_copy → select_content` ظاهر |
| 6 | اجعل `generate_lead` فقط Key event عند نجاح نموذج التواصل. يمكن اعتبار `tool_complete` مقياس استخدام، لا تحويلاً تجارياً افتراضياً. | تقارير التحويل لا تتضخم بتفاعلات غير تجارية |

تدعم GA4 أحداثاً تلقائية ومحسنة وأحداثاً موصى بها ومخصصة. هنا نستخدم `select_content` للجسر إلى المشروع لأنه اختيار محتوى واضح، ونستخدم أحداثاً مخصصة لتفاصيل استخدام الأداة [4] [5]. لا تسجل كمعاملات: `source.value`، أو `cleaned_text`، أو `slug`، أو `encoded_slug`، أو عنوان URL المدخل، أو JWT، أو بريد أو أي معرّف شخصي.

## Google Search Console: خطوات بعد النشر

1. أضف خاصية URL-prefix: `https://majid-alsakani.github.io/majid-alsakani-portfolio/`.
2. اختر طريقة **HTML tag** في واجهة إثبات الملكية. أرسل الوسم فقط ليُضاف كما هو إلى الصفحة الرئيسية؛ لا ترسل كلمة مرور Google أو جلسة تسجيل الدخول.
3. بعد التحقق، أرسل `https://majid-alsakani.github.io/majid-alsakani-portfolio/sitemap.xml` من تقرير Sitemaps.
4. انشر صفحة الأداة باللغتين ثم افحص الرابطين في URL Inspection. تحقق من أن canonical الذي تختاره Google يطابق الصفحة، ثم استخدم Request indexing.
5. بعد مرور عدة أيام، فلتر تقرير Performance حسب صفحة الأداة وقارن **Queries / Pages / Country / Device / Date**. لا تحكم بالبحث اليدوي؛ النتائج تتغير مع الجهاز والموقع والسجل [6].

Search Console يقدم النقرات والانطباعات وCTR ومتوسط الموضع، بينما GA4 يقيس ما يفعله الشخص بعد وصوله. لا تتوقع تطابق عدد نقرات Search Console مع جلسات GA4؛ تقارن الاتجاه العام وتستخدم كل أداة لموضعها في المسار [7].

## لوحة القرار: القياسات الدقيقة

| سؤال القرار | المقياس | الصيغة | القسم المسؤول |
|---|---|---|---|
| هل يصل البحث إلى الصفحة؟ | Impressions وClicks وCTR | من Search Console حسب Landing page/query | الاكتشاف |
| هل الوعد في العنوان مناسب؟ | Tool start rate | `tool_start ÷ مستخدمي صفحة الأداة` | نية الاستخدام |
| هل تنجح الأداة؟ | Completion rate | `tool_complete ÷ tool_start` | جودة المهمة |
| هل الناتج مفيد؟ | Copy rate | `tool_copy ÷ tool_complete` | قيمة النتيجة |
| هل تقود الأداة للمعرض؟ | Project bridge rate | `select_content(project_cta) ÷ tool_complete` | جسر الأدوات → المشاريع |
| هل تتحول إلى فرصة؟ | Lead rate | `generate_lead ÷ مستخدمي صفحة الأداة` | نتيجة الأعمال |
| أين توجد المشكلة؟ | Error rate | `tool_error ÷ tool_start`، مقسماً حسب `error_category` وdevice وlocale | تجربة المستخدم |

تبدأ تجربة التحسين الأولى بعد تكوين خط أساس لأربعة أسابيع: بدّل نص CTA فقط من «افتح ملف الدليل» إلى «شاهد كيف اختبرت جودة واجهات RTL في Qalam»، ثم قارن Project bridge rate ومعدل إكمال الأداة خلال نافذتين زمنيتين متشابهتين. لا تغيّر عنوان الصفحة وCTA وسلوك الأداة معاً.

## References

[1] [Adawa — Arabic and English Slug Generator](https://adawa.at/en/programming-tools/arabic-slug-generator)

[2] [ArabicSlug — Arabic text to Latin and URL slug converter](https://github.com/itsalimanuel/arabicSlug)

[3] [Arabic Text Tools — Arabic Text Cleaner](https://www.karmouch.me/tools)

[4] [Google Analytics Developer — Set up events](https://developers.google.com/analytics/devguides/collection/ga4/events)

[5] [Google Analytics Help — Recommended events](https://support.google.com/analytics/answer/9267735)

[6] [Google Search Console Help — Performance report](https://support.google.com/webmasters/answer/7576553)

[7] [Google Search Central — Using Search Console and Google Analytics data for SEO](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console)
