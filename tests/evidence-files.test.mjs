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
  "projects/index.html",
  "ar/projects/index.html",
  "assets/css/tools-hub.css",
  "assets/js/tools-runtime.js",
  "tools/index.html",
  "ar/tools/index.html",
  "tools/json-formatter/index.html",
  "ar/tools/json-formatter/index.html",
  "tools/jwt-decoder/index.html",
  "ar/tools/jwt-decoder/index.html",
  "tools/timestamp-converter/index.html",
  "ar/tools/timestamp-converter/index.html",
  "tools/utm-builder/index.html",
  "ar/tools/utm-builder/index.html",
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
assert.match(homeInteractions, /project-updates/, "home should insert a project-adjacent updates section");
assert.match(homeInteractions, /settleProjectAnchor/, "home should settle the projects anchor after a direct visit");
assert.match(homeInteractions, /is-settling-project-anchor/, "deep-linked project anchor should bypass smooth scrolling until it settles");
assert.match(homeInteractions, /tools-shortcut/, "home should expose a visible shortcut to the tools hub");
assert.match(homeInteractions, /data-tools-nav/, "home navigation should expose a direct tools route");

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

const projectArchive = read("projects/index.html");
assert.match(projectArchive, /<title>Portfolio Projects/, "English project archive should expose a search-focused title");
assert.match(projectArchive, /@type":"CollectionPage"/, "English project archive should describe itself as a CollectionPage");
assert.match(projectArchive, /@type":"ItemList"/, "English project archive should expose an ItemList");
assert.match(projectArchive, /numberOfItems":14/, "English project archive should enumerate fourteen projects");
const arabicProjectArchive = read("ar/projects/index.html");
assert.match(arabicProjectArchive, /<html lang="ar" dir="rtl">/, "Arabic project archive should preserve RTL direction");
assert.match(arabicProjectArchive, /@type":"CollectionPage"/, "Arabic project archive should expose CollectionPage data");
assert.match(arabicProjectArchive, /numberOfItems":14/, "Arabic project archive should enumerate fourteen projects");
const archiveCaseFiles = [...projectArchive.matchAll(caseLinkPattern), ...arabicProjectArchive.matchAll(caseLinkPattern)].map((match) => match[1]);
assert.equal(archiveCaseFiles.length, 28, "the two project archive pages should expose every evidence file");
archiveCaseFiles.forEach((fileName) => {
  assert.ok(existsSync(resolve(docs, "case-studies", fileName)), `project archive case file ${fileName} should exist`);
});
const sitemap = read("sitemap.xml");
assert.match(sitemap, /majid-alsakani-portfolio\/projects\//, "sitemap should include the English projects archive");
assert.match(sitemap, /majid-alsakani-portfolio\/ar\/projects\//, "sitemap should include the Arabic projects archive");
const projectStyles = read("assets/css/project-index.css");
assert.match(projectStyles, /scroll-margin-block-start/, "project anchor should account for the sticky mobile header");
assert.match(projectStyles, /project-directory-and-updates/, "styles should place latest updates beside the project directory");

const toolsHub = read("tools/index.html");
assert.match(toolsHub, /@type":"CollectionPage"/, "tools hub should expose CollectionPage data");
assert.match(toolsHub, /numberOfItems":4/, "tools hub should enumerate the four launch tools");
const arabicToolsHub = read("ar/tools/index.html");
assert.match(arabicToolsHub, /<html lang="ar" dir="rtl">/, "Arabic tools hub should preserve RTL direction");
const toolPages = ["json-formatter", "jwt-decoder", "timestamp-converter", "utm-builder"];
toolPages.forEach((tool) => {
  const englishTool = read(`tools/${tool}/index.html`);
  const arabicTool = read(`ar/tools/${tool}/index.html`);
  assert.match(englishTool, /@type":"SoftwareApplication"/, `${tool} should include SoftwareApplication data`);
  assert.match(englishTool, /rel="canonical"/, `${tool} should include a canonical URL`);
  assert.match(arabicTool, /inLanguage":"ar"/, `Arabic ${tool} should use Arabic structured data`);
  assert.match(sitemap, new RegExp(`/tools/${tool}/`), `${tool} should be included in the sitemap`);
  assert.match(sitemap, new RegExp(`/ar/tools/${tool}/`), `Arabic ${tool} should be included in the sitemap`);
});
const toolsRuntime = read("assets/js/tools-runtime.js");
["processJson", "decodeJwt", "convertTimestamp", "buildUtm"].forEach((functionName) => assert.match(toolsRuntime, new RegExp(`function ${functionName}`), `${functionName} should be implemented client-side`));
assert.doesNotMatch(toolsRuntime, /fetch\(/, "tools should not submit visitor inputs to a remote endpoint");

const nowPage = read("now.html");
assert.match(nowPage, /data-now-source/, "Now page should receive a dynamic source");
assert.match(nowPage, /data-now-grid/, "Now page should render current project cards dynamically");
const nowScript = read("assets/js/now-signal.js");
assert.match(nowScript, /fetch\(source\)/, "Now page should load its editable work-status data");

console.log("Evidence Files integrity checks passed.");
