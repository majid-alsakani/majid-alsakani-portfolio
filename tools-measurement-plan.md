# Arabic Slug & Text Cleaner — Implementation and Measurement Plan

## 1. Product role

الهدف من الأداة ليس «توليد كلمات مفتاحية» أو إعادة كتابة المحتوى بغرض الترتيب، بل إنجاز مهمة فعلية للمحررين والمطورين: تنظيف عنوان عربي، والحفاظ على دلالته، ثم إنتاج slug صالح للمسار ويمكن نسخه. هذا ينسجم مع إرشادات Google التي تركز على الفائدة الأصلية للمستخدم، لا إنشاء صفحات لمجرد اجتذاب الزيارات [1].

تظهر صيغ البحث المتكررة حول «Arabic slug generator»، و«تحويل عنوان عربي إلى رابط»، و«Arabic text cleaner» ضمن أدوات قائمة ومكتبات مفتوحة المصدر [10] [11] [12]. تستخدم هذه الصيغ لتسمية الصفحة والواجهة وFAQ بما يطابق نية الزائر، لا كدليل على حجم بحث أو وعد بالترتيب؛ قياس الطلب الفعلي يبدأ من Search Console بعد النشر.

ستكون الوجهة العربية الأساسية هي:

`/ar/tools/arabic-slug-text-cleaner/`

وتوجد صفحة إنجليزية مقابلة تشرح الأداة وتستخدم المثال العربي نفسه مع `hreflang`:

`/tools/arabic-slug-text-cleaner/`

تُضاف بطاقة للأداة إلى بوابة الأدوات وإلى اختصار الصفحة الرئيسية، مع رابط سياقي من صفحة الأداة إلى مشروع **Qalam Arabic Interface QA**؛ هكذا يكتشف الزائر دليلاً حقيقياً على الخبرة المرتبطة بالأداة بعد إتمام مهمته.

## 2. مواصفات الأداة

| السطح | السلوك المطلوب | حد الجودة |
|---|---|---|
| النص المدخل | حقل نص متعدد الأسطر مع عداد أحرف وكلمات | لا تُرسل القيمة إلى خادم ولا تسجل في التحليلات |
| منظف النص | توحيد Unicode بصيغة NFC، إزالة التطويل `ـ`، استبدال المسافات المتكررة بمسافة واحدة، وإزالة علامات ترقيم غير مناسبة | لا يغير الكلمات أو يعيد صياغتها |
| خيارات صريحة | تبديل اختياري لإزالة التشكيل وتبديل آخر لتطبيع `أ/إ/آ` إلى `ا` | الوضع الافتراضي يحافظ على النص قدر الإمكان |
| slug عربي | كلمات مفصولة بـ`-` مع بقاء الحروف العربية؛ تعرض الأداة أيضاً النسخة URL-encoded للنسخ | لا تعِد بتحسين SEO تلقائي أو ترتيب أعلى |
| slug لاتيني | تحويل اختياري عبر جدول تحويل ثابت ومرئي في الكود، مع تحذير بأن transliteration اصطلاحي وليس ترجمة | لا تستخدم ترجمة آلية أو توليداً غامضاً |
| النتائج | النص المنظف، slug العربي، النسخة المرمزة، slug اللاتيني الاختياري، وأزرار نسخ مستقلة | إظهار حالة نجاح/خطأ واضحة ومتاحة لقارئ الشاشة |
| أمثلة | أمثلة محررة وليست استعلامات مستخدمين: عنوان مقالة، عنوان منتج، وعنوان عربي مشكّل | زر «استخدم مثالاً» يظل اختيارياً |

سيُنفذ المنظف في `tools-runtime.js` محلياً، ويضاف لكل من صفحتي الأداة عنوان ووصف وcanonical وبدائل `hreflang` وبيانات `SoftwareApplication` تطابق الواجهة المرئية. هذا مهم لأن Google تنص على أن البيانات المنظمة يجب أن تصف محتوى موجوداً في الصفحة، وأن JSON-LD هو الشكل الأسهل عادةً للصيانة [2].

## 3. Google Search Console: الإعداد الصحيح لموقع GitHub Pages

يُنشأ **URL-prefix property** بالقيمة الدقيقة:

`https://majid-alsakani.github.io/majid-alsakani-portfolio/`

لا يُنصح بمحاولة إضافة `github.io` كـDomain property؛ نطاقه لا يملكه صاحب المعرض. في معالج إثبات الملكية نختار **HTML tag**، ثم ينسخ المستخدم وسم التحقق الذي تولده Google. يوضع الوسم كما هو داخل `<head>` للصفحة الجذرية `docs/index.html`؛ عندها يمكن إثبات الملكية لأن Search Console يتحقق من الوسم في الصفحة التي يصل إليها زائر غير مسجل من عنوان الخاصية [3]. يجب عدم حذف الوسم لاحقاً، ويفضل إضافة طريقة تحقق ثانية عندما تصبح متاحة لأن Google تعيد التحقق دورياً [3].

بعد نجاح التحقق، تُرسل خريطة الموقع الموجودة حالياً:

`https://majid-alsakani.github.io/majid-alsakani-portfolio/sitemap.xml`

تحتوي الخريطة بالفعل على بوابة الأدوات وصفحاتها؛ يجب أن تضاف صفحة Arabic Slug الجديدة عند نشرها. خريطة الموقع إشارة للاكتشاف وليست وعداً بالفهرسة، ويجب أن تحتوي فقط على الصفحات الأساسية ذات الروابط الأساسية canonical [4]. بعد النشر نستخدم **URL Inspection** على الصفحة العربية والإنجليزية، نتحقق من canonical الذي اختارته Google، ثم نطلب الفهرسة للصفحتين. ظهور البيانات قد يستغرق بضعة أيام، ولا ينبغي تفسير غيابها الفوري على أنه عطل [3].

## 4. طبقة القياس: ما الذي نحتاجه فوق Search Console؟

Search Console يقيس ما يحدث **قبل** وصول الزائر إلى الموقع: الانطباعات والنقرات والاستعلامات والصفحات. أما فهم استخدام الأداة والانتقال إلى المشاريع فيحتاج Google Analytics 4 أو منصة تحليلات أحداث مكافئة؛ توصي Google بدمج المصدرين لمعرفة علاقة اكتشاف البحث بسلوك الزائر داخل الموقع [5].

إذا اختير GA4، تُنشأ Web data stream للموقع ويضاف Google tag بعد موافقة المالك على معرف Measurement ID. يمكن إرسال أحداث مخصصة باستخدام `gtag('event', ...)`، والتحقق منها عبر Realtime وDebugView [6]. لا يجب إرسال النص المدخل، أو slug الناتج، أو JWT، أو رابط UTM كامل، أو أي قيمة قد تكون شخصية أو حساسة.

| الحدث | متى يُرسل | معاملات مسموحة | لماذا نقيسه |
|---|---|---|---|
| `view_item_list` | ظهور بوابة الأدوات | `item_list_name: "tools_hub"`, `locale` | قياس رؤية المجموعة |
| `select_content` | النقر على بطاقة أداة | `content_type: "tool"`, `item_id`, `entry_surface` | معرفة ما الذي يختاره الزائر |
| `tool_start` | أول إدخال غير فارغ | `tool_id`, `locale`, `input_length_bucket` | التفريق بين مشاهدة الأداة وبدء استعمالها |
| `tool_complete` | حصول الأداة على نتيجة صالحة | `tool_id`, `locale`, `result_type` | المقياس الرئيسي لقيمة الأداة |
| `tool_error` | خطأ تحقق أو مدخل غير صالح | `tool_id`, `error_category` | كشف عوائق التجربة، بلا حفظ النص |
| `tool_copy` | نسخ نتيجة | `tool_id`, `output_kind` | إشارة قيمة أقوى من مجرد عرض نتيجة |
| `select_content` | النقر على مشروع بعد إتمام الأداة | `content_type: "project_cta"`, `item_id`, `tool_id`, `cta_position` | قياس الجسر من الأداة إلى ملف الأعمال |
| `generate_lead` | إرسال نموذج التواصل بنجاح | `method: "contact_flow"`, `source_surface` | مقياس نتيجة أعمال، لا مجرد نقرة |

الأسماء `select_content` و`generate_lead` تتوافق مع الأحداث الموصى بها في GA4 عندما تنطبق دلالتها، بينما `tool_start` و`tool_complete` مخصصان لأنهما يصفان تفاعل الأداة بدقة [7]. تراجع الأحداث أولاً في DebugView قبل اعتبار أي منها key event.

## 5. لوحة قياس شهرية

| طبقة المسار | المقياس | الصيغة أو التقسيم | ماذا يعني التغير |
|---|---|---|---|
| الاكتشاف | الانطباعات، النقرات، CTR، ومتوسط الموضع | Search Console، حسب صفحة الأداة والاستعلام والجهاز والبلد | ارتفاع الانطباعات بلا نقرات يستدعي تحسين العنوان والوصف؛ لا يُقرأ متوسط الموضع كترتيب ثابت منفرد |
| الفهرسة | الصفحات المفهرسة، أسباب عدم الفهرسة، وcanonical المختار | Page indexing وURL Inspection | نصلح مشكلة الموقع فقط؛ لا نتوقع فهرسة 100% من كل URL [8] |
| نية الاستخدام | Tool start rate | `tool_start ÷ مستخدمي صفحة الأداة` | يكشف هل الوعد في عنوان الصفحة يطابق ما يتوقعه الزائر |
| نجاح المهمة | Completion rate | `tool_complete ÷ tool_start` | انخفاضه يعني مشكلة إدخال أو توجيه أو نتيجة |
| قيمة النتيجة | Copy rate | `tool_copy ÷ tool_complete` | إشارة أن الناتج قابل للاستخدام خارج الموقع |
| جسر المعرض | Project bridge CTR | `project_cta_click ÷ tool_complete` و`÷ مستخدمي صفحة الأداة` | يقيّم قدرة CTA على نقل الزائر إلى العمل، لا حجم الزيارات وحده |
| نتيجة أعمال | Contact conversion | `generate_lead ÷ مستخدمي الأداة`، مع تقسيم المصدر | يربط القسم بقيمة المعرض الفعلية |
| الجودة | Engagement rate، الوقت حتى أول نتيجة، ومعدل الخطأ | حسب الأداة واللغة والجهاز | يشير إلى سهولة الاستخدام، خصوصاً الهاتف وRTL |

في Search Console تُراجع بيانات **الاستعلامات، الصفحات، البلدان، الأجهزة، والتواريخ**. تعرض المنصة النقرات والانطباعات وCTR ومتوسط الموضع بهذه التقسيمات، لكن نتائج البحث تتغير حسب المكان والجهاز والتاريخ وسجل المستخدم، لذا لا يصح تقييم القرار عبر بحث يدوي واحد [9]. في Analytics، تقارن جلسات `google / organic` بالأحداث السابقة وتفصل العربية عن الإنجليزية والجوال عن سطح المكتب. النقرات في Search Console والجلسات في Analytics لن تتطابق بالضرورة؛ المهم هو اتجاههما العام لا التطابق الحسابي الحرفي [5].

## 6. خطة التحسين التجريبي

يُؤخذ خط أساس لأربعة أسابيع بعد اكتمال الفهرسة، ثم يُغيّر متغير واحد فقط في كل تجربة: موضع CTA المرتبط بمشروع Qalam، أو نصه، أو ظهور المثال الأول، أو ترتيب بطاقة Arabic Slug في البوابة. لا تغيّر العنوان والوصف ومحتوى الأداة والـCTA معاً، وإلا يتعذر معرفة سبب النتيجة.

تكون أول تجربة مقترحة كالتالي: تعرض الصفحة بعد النتيجة الصحيحة رابطاً محدداً يقول **«شاهد كيف اختبرت جودة واجهات RTL في Qalam»** بدلاً من رابط عام للمشاريع. نقارن `project_cta_click / tool_complete` ومعدل العودة إلى المشروع، مع التأكد من أن معدل الإكمال لا ينخفض. إذا كان CTA الخاص أعلى دون إضرار بنجاح الأداة، يطبق النمط على الأدوات الأخرى باستخدام مشروع ذي صلة حقيقية فقط.

## 7. ترتيب التنفيذ

| الأسبوع | العمل | قرار الانتقال |
|---|---|---|
| 1 | بناء الأداة وصفحتيها وإضافة بطاقة البوابة وروابط Qalam وخريطة الموقع | اجتياز الوظائف والهاتف وSEO المحلي |
| 2 | إدخال وسم Search Console وإثبات الملكية وإرسال sitemap وفحص URL | ظهور حالة الزحف وعدم وجود أخطاء واضحة |
| 3 | إضافة GA4 بعد موافقة المالك وMeasurement ID، ثم DebugView للأحداث | تحقق أحداث البداية والنجاح والنسخ وCTA بلا قيم مدخلة |
| 4–7 | مراقبة الأداء دون تعديل متزامن | تكوين خط أساس كافٍ لاتجاهات البحث والاستخدام |
| 8 | تنفيذ تجربة CTA واحدة ومقارنة نافذتين متماثلتين زمنياً | اعتماد تغيير أو التراجع عنه بناءً على نجاح المهمة والجسر إلى المشاريع |

## References

[1] [Google Search Central — Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

[2] [Google Search Central — Introduction to structured data](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data)

[3] [Search Console Help — Verify your site ownership](https://support.google.com/webmasters/answer/9008080)

[4] [Google Search Central — Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

[5] [Google Search Central — Using Search Console and Google Analytics data for SEO](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console)

[6] [Google Analytics Developer — Set up events](https://developers.google.com/analytics/devguides/collection/ga4/events)

[7] [Google Analytics Help — Recommended events](https://support.google.com/analytics/answer/9267735)

[8] [Search Console Help — Page indexing report](https://support.google.com/webmasters/answer/7440203)

[9] [Search Console Help — Performance report](https://support.google.com/webmasters/answer/7576553)

[10] [Adawa — Arabic and English Slug Generator](https://adawa.at/en/programming-tools/arabic-slug-generator)

[11] [ArabicSlug — Arabic text to Latin and URL slug converter](https://github.com/itsalimanuel/arabicSlug)

[12] [Arabic Text Tools — Arabic Text Cleaner](https://www.karmouch.me/tools)
