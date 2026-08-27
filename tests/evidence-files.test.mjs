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
  "assets/motion/signal-noir-home-reel.mp4",
  "assets/audio/signal-noir-transition.mp3",
  "assets/js/now-signal.js",
  "assets/data/now-status.json",
  "assets/data/now-status-ar.json",
  "case-studies/index.html",
  "ar/case-studies/index.html",
  "contact.html",
  "now.html",
  "ar/now.html",
];
requiredFiles.forEach((relativePath) => assert.ok(existsSync(resolve(docs, relativePath)), `${relativePath} should exist`));

const sharedStyles = read("assets/css/evidence-files.css");
assert.match(sharedStyles, /body:has\(\.v1-case\)/, "detailed case files should use the Evidence Files styling");
assert.match(sharedStyles, /body:has\(\.suite-case\)/, "suite case files should use the Evidence Files styling");

const archive = read("case-studies/index.html");
["joobea.html", "sini-alkhafif.html", "omni-agent-ai.html", "signalroom.html"].forEach((fileName) => {
  assert.match(archive, new RegExp(`href="${fileName}"`), `${fileName} should remain linked from the archive`);
});
assert.match(archive, /ef-primary-reel/, "archive should include the three-project cinematic reel");
assert.match(archive, /joobea-signal-motion\.mp4/, "archive reel should use the real Joobea motion study");

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

const home = read("index.html");
assert.match(home, /signal-noir-home-reel\.mp4/, "home hero should include the combined project reel");
assert.match(home, /data-signal-audio/, "home hero should expose optional audio control");
assert.match(home, /data-signal-transition/, "home should register the optional transition audio");
const homeInteractions = read("assets/js/cinema-home.js");
assert.match(homeInteractions, /soundToggle/, "home script should handle optional sound control");
assert.match(homeInteractions, /transitionSound\.volume = 0\.18/, "transition sound should remain low-level by default");

assert.match(home, /id="projects"/, "home should provide a permanent projects index");
assert.match(home, /Explore all projects/, "home hero should guide visitors to all projects");
assert.match(home, /Evidence · 14/, "primary navigation should expose the case-study archive");
[
  "https://joobea.com",
  "https://sinialkhafifapp.com",
  "https://github.com/majid-alsakani/omni-agent-ai",
  "case-studies/signalroom.html",
].forEach((destination) => {
  assert.match(home, new RegExp(destination.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `home should expose ${destination}`);
});
const arabicHome = read("ar/index.html");
assert.match(arabicHome, /id="projects"/, "Arabic home should provide a permanent projects index");
assert.match(arabicHome, /كل المشاريع/, "Arabic home should expose the projects navigation");

const caseLinkPattern = /href="\/majid-alsakani-portfolio\/(?:ar\/)?case-studies\/([^"#]+\.html)"/g;
const indexedCaseFiles = [...home.matchAll(caseLinkPattern), ...arabicHome.matchAll(caseLinkPattern)].map((match) => match[1]);
assert.ok(indexedCaseFiles.length >= 22, "the two project indexes should link to the complete case-file directory");
indexedCaseFiles.forEach((fileName) => {
  assert.ok(existsSync(resolve(docs, "case-studies", fileName)), `indexed case file ${fileName} should exist`);
});

const nowPage = read("now.html");
assert.match(nowPage, /data-now-source/, "Now page should receive a dynamic source");
assert.match(nowPage, /data-now-grid/, "Now page should render current project cards dynamically");
const nowScript = read("assets/js/now-signal.js");
assert.match(nowScript, /fetch\(source\)/, "Now page should load its editable work-status data");

console.log("Evidence Files integrity checks passed.");
