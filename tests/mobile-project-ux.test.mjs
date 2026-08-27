/** Arabic mobile UX smoke test: checks the project anchor, mobile scroll fallback and visible interactive targets in Chromium. */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const port = 9329;
const baseUrl = "http://localhost:4174/majid-alsakani-portfolio/ar/?ux-test=1#projects";
const chrome = spawn("chromium", [
  "--headless", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, "about:blank",
], { stdio: "ignore" });

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
let socket;

try {
  let target;
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" });
      if (response.ok) { target = await response.json(); break; }
    } catch { /* Chromium is still starting. */ }
    await sleep(150);
  }
  assert.ok(target?.webSocketDebuggerUrl, "Chromium should expose a debugging target");

  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let requestId = 0;
  const awaiting = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    const listener = awaiting.get(message.id);
    if (!listener) return;
    awaiting.delete(message.id);
    if (message.error) listener.reject(new Error(message.error.message));
    else listener.resolve(message.result);
  });
  const cdp = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++requestId;
    awaiting.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await cdp("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    return response.result.value;
  };

  await cdp("Page.enable");
  await cdp("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  await cdp("Emulation.setUserAgentOverride", { userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148" });
  await cdp("Page.navigate", { url: baseUrl });
  await sleep(1000);

  const mobileState = await evaluate(`new Promise((resolve) => setTimeout(() => {
    const projects = document.getElementById("projects");
    const stage = document.querySelector(".cine-scroll-stage");
    const header = document.querySelector(".cine-topbar");
    const links = [...document.querySelectorAll("#projects a")];
    resolve({
      direction: document.documentElement.lang,
      viewport: window.innerWidth,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      projectTop: Math.round(projects.getBoundingClientRect().top),
      headerHeight: Math.round(header.getBoundingClientRect().height),
      stagePosition: getComputedStyle(stage).position,
      visibleProjectLinks: links.filter((link) => link.getBoundingClientRect().width > 0 && link.getBoundingClientRect().height > 0).length,
      revealed: [...projects.querySelectorAll("[data-reveal]")].every((element) => element.classList.contains("in")),
      scrollHeight: document.documentElement.scrollHeight,
    });
  }, 450))`);

  assert.equal(mobileState.direction, "ar", "test should load the Arabic page");
  assert.ok(mobileState.viewport >= 390 && mobileState.viewport <= 420, "Arabic page should render within the intended mobile CSS width range");
  assert.equal(mobileState.scrollBehavior, "smooth", "normal visitor scrolling should remain smooth");
  assert.equal(mobileState.stagePosition, "relative", "mobile cinematic scenes should remain in normal document flow");
  assert.ok(mobileState.projectTop >= mobileState.headerHeight - 2 && mobileState.projectTop < mobileState.headerHeight + 25, "deep-link should settle the project index beneath the sticky header");
  assert.ok(mobileState.visibleProjectLinks >= 20, "project cards and evidence links should be available on mobile");
  assert.equal(mobileState.revealed, true, "deep-linked project content should not stay hidden behind reveal animation");

  const scrollJourney = await evaluate(`new Promise((resolve) => {
    const before = window.scrollY;
    window.scrollBy({ top: 620, behavior: "instant" });
    requestAnimationFrame(() => requestAnimationFrame(() => resolve({ before, after: window.scrollY, max: document.documentElement.scrollHeight - innerHeight })));
  })`);
  assert.ok(scrollJourney.after > scrollJourney.before, "mobile project journey should continue scrolling without a pinned-stage lock");
  assert.ok(scrollJourney.after < scrollJourney.max, "mobile project journey should retain content beyond the first project group");

  const screenshot = await cdp("Page.captureScreenshot", { format: "png" });
  writeFileSync("/tmp/arabic-mobile-ux/mobile-projects-fixed.png", Buffer.from(screenshot.data, "base64"));
  console.log("Arabic mobile project UX checks passed.");
} finally {
  socket?.close();
  chrome.kill("SIGTERM");
}
