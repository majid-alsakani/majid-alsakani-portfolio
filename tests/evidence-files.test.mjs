/** Evidence Files integrity test: verifies the cinematic archive and contact-flow contracts without a build tool. */
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const docs = resolve(root, "docs");
const read = (relativePath) => readFileSync(resolve(docs, relativePath), "utf8");

const requiredFiles = [
  "assets/css/evidence-files.css",
  "assets/js/evidence-files.js",
  "assets/motion/joobea-signal-motion.mp4",
  "assets/motion/sini-progress-motion.mp4",
  "assets/motion/omni-orchestration-motion.mp4",
  "case-studies/index.html",
  "ar/case-studies/index.html",
  "contact.html",
];
requiredFiles.forEach((relativePath) => assert.ok(existsSync(resolve(docs, relativePath)), `${relativePath} should exist`));

const sharedStyles = read("assets/css/evidence-files.css");
assert.match(sharedStyles, /body:has\(\.v1-case\)/, "detailed case files should use the Evidence Files styling");
assert.match(sharedStyles, /body:has\(\.suite-case\)/, "suite case files should use the Evidence Files styling");

const archive = read("case-studies/index.html");
["joobea.html", "sini-alkhafif.html", "omni-agent-ai.html", "signalroom.html"].forEach((fileName) => {
  assert.match(archive, new RegExp(`href="${fileName}"`), `${fileName} should remain linked from the archive`);
});

const arabicArchive = read("ar/case-studies/index.html");
assert.match(arabicArchive, /<html dir="rtl" lang="ar">/, "Arabic archive should preserve RTL direction");
assert.match(arabicArchive, /basira-accessibility-radar\.html/, "Arabic case links should remain available");

const contact = read("contact.html");
assert.match(contact, /data-contact-flow/, "Contact page should expose the interactive flow");
assert.match(contact, /data-step="4"/, "Contact page should include the final contact stage");
assert.match(contact, /https:\/\/formsubmit\.co\/majidalsakani@gmail\.com/, "Contact delivery endpoint should remain configured");

const interactions = read("assets/js/evidence-files.js");
assert.match(interactions, /function showStep/, "Contact flow script should provide staged navigation");
assert.match(interactions, /project_type/, "Contact flow script should capture the selected project type");
assert.match(interactions, /form\.checkValidity\(\)/, "Contact flow should validate required fields before submission");

const motionFiles = [
  ["case-studies/joobea.html", "joobea-signal-motion.mp4"],
  ["case-studies/sini-alkhafif.html", "sini-progress-motion.mp4"],
  ["case-studies/omni-agent-ai.html", "omni-orchestration-motion.mp4"],
];
motionFiles.forEach(([casePath, videoName]) => {
  const caseStudy = read(casePath);
  assert.match(caseStudy, new RegExp(videoName), `${casePath} should reference ${videoName}`);
  assert.match(caseStudy, /autoplay controls loop muted playsinline/, `${casePath} should expose a silent looping video with controls`);
  assert.match(caseStudy, /poster="\/majid-alsakani-portfolio\//, `${casePath} should provide a poster fallback`);
});

console.log("Evidence Files integrity checks passed.");
