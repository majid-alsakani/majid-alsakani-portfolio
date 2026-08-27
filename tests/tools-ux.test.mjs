/** Tools UX test: verifies that every first-release browser utility produces a useful result. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 9331;
const base = "http://localhost:4174/majid-alsakani-portfolio/tools/";
const chrome = spawn("chromium", ["--headless", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, "about:blank"], { stdio: "ignore" });
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let socket;

try {
  let target;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
      if (response.ok) { target = await response.json(); break; }
    } catch { /* Chromium is starting. */ }
    await sleep(150);
  }
  assert.ok(target?.webSocketDebuggerUrl, "Chromium should expose a debugging target");
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });

  let requestId = 0;
  const awaiting = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data); const listener = awaiting.get(message.id);
    if (!listener) return; awaiting.delete(message.id);
    if (message.error) listener.reject(new Error(message.error.message)); else listener.resolve(message.result);
  });
  const cdp = (method, params = {}) => new Promise((resolve, reject) => { const id = ++requestId; awaiting.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => (await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result.value;
  const visit = async (path) => { await cdp("Page.navigate", { url: base + path }); await sleep(450); };

  await cdp("Page.enable");
  await visit("json-formatter/");
  const json = await evaluate(`(() => { const input = document.querySelector('#tool-input'); input.value = '{"project":"Joobea","live":true}'; document.querySelector('#format-json').click(); return { result: document.querySelector('#tool-result').textContent, status: document.querySelector('#tool-status').textContent }; })()`);
  assert.match(json.result, /"project": "Joobea"/, "JSON formatter should indent valid JSON");
  assert.match(json.status, /Valid JSON/, "JSON formatter should report valid data");

  await visit("jwt-decoder/");
  const jwt = await evaluate(`(() => { document.querySelector('#sample-jwt').click(); return document.querySelector('#tool-result').textContent; })()`);
  assert.match(jwt, /HEADER/, "JWT tool should expose a header");
  assert.match(jwt, /demo-user/, "JWT tool should decode the sample payload");
  assert.match(jwt, /does not validate its signature/, "JWT tool should retain the trust warning");

  await visit("timestamp-converter/");
  const timestamp = await evaluate(`(() => { const input = document.querySelector('#tool-input'); input.value = '0'; document.querySelector('#convert-time').click(); return document.querySelector('#tool-result').textContent; })()`);
  assert.match(timestamp, /1970-01-01T00:00:00.000Z/, "timestamp tool should convert Unix epoch to ISO");
  assert.match(timestamp, /Unix seconds\n0/, "timestamp tool should show seconds");

  await visit("utm-builder/");
  const utm = await evaluate(`(() => { const form = document.querySelector('#utm-form'); form.elements.url.value = 'https://example.com/product?ref=home'; form.elements.source.value = 'newsletter'; form.elements.medium.value = 'email'; form.elements.campaign.value = 'launch'; document.querySelector('#build-utm').click(); return document.querySelector('#tool-result').textContent; })()`);
  assert.match(utm, /ref=home/, "UTM builder should preserve existing query parameters");
  assert.match(utm, /utm_source=newsletter/, "UTM builder should include campaign source");
  assert.match(utm, /utm_campaign=launch/, "UTM builder should include campaign name");

  await cdp("Page.navigate", { url: "http://localhost:4174/majid-alsakani-portfolio/ar/tools/arabic-slug-text-cleaner/" });
  await sleep(450);
  const slug = await evaluate(`(() => {
    const events = [];
    window.gtag = (...args) => events.push(args);
    const input = document.querySelector('#tool-input');
    input.value = 'آثارُ واجهةٍ ـــ عربية!!!';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#strip-diacritics').checked = true;
    document.querySelector('#normalize-letters').checked = true;
    document.querySelector('#include-latin').checked = true;
    document.querySelector('#make-slug').click();
    return { result: document.querySelector('#tool-result').textContent, status: document.querySelector('#tool-status').textContent, events };
  })()`);
  assert.match(slug.result, /اثار-واجهة-عربية/, "Arabic slug tool should clean diacritics, tatweel and punctuation without removing Arabic text");
  assert.match(slug.result, /%D8%A7%D8%AB%D8%A7%D8%B1/, "Arabic slug tool should provide a URL-encoded slug");
  assert.match(slug.result, /Slug لاتيني اختياري/, "Arabic slug tool should provide the optional Latin output when selected");
  assert.match(slug.status, /تم إنشاء النتائج محلياً/, "Arabic slug tool should confirm local processing");
  const serializedEvents = JSON.stringify(slug.events);
  assert.doesNotMatch(serializedEvents, /آثار|واجهة|عربية/, "tool analytics should never include the user input or output");
  assert.match(serializedEvents, /tool_start/, "Arabic slug tool should expose an optional start event when GA4 is configured");
  assert.match(serializedEvents, /tool_complete/, "Arabic slug tool should expose an optional completion event when GA4 is configured");

  console.log("Tools browser UX checks passed.");
} finally { socket?.close(); chrome.kill("SIGTERM"); }
