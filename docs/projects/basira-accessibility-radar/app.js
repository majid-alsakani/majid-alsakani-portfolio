const input = document.querySelector('#html-input');
const scanButton = document.querySelector('#scan');
const goodButton = document.querySelector('#load-good');
const findingsEl = document.querySelector('#findings');
const reportTitle = document.querySelector('#report-title');
const issueCount = document.querySelector('#issue-count');
const criticalCount = document.querySelector('#critical-count');
const warningCount = document.querySelector('#warning-count');
const passCount = document.querySelector('#pass-count');
const year = document.querySelector('#year');

const goodSample = `<main lang="en" dir="ltr">\n  <h1>Welcome to our app</h1>\n  <label for="email">Email address</label>\n  <input id="email" type="email" autocomplete="email">\n  <button type="submit">Save changes</button>\n  <a href="/help">Read the help guide</a>\n</main>`;

function escapeHtml(value) { return value.replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[char])); }
function finding(level, title, detail, fix) { return { level, title, detail, fix }; }

function scan(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const results = [];
  const main = doc.querySelector('main') || doc.body;
  const lang = doc.documentElement.getAttribute('lang') || main?.getAttribute('lang');
  const dir = doc.documentElement.getAttribute('dir') || main?.getAttribute('dir');
  if (!lang) results.push(finding('critical', 'Missing language metadata', 'The document does not declare a primary language.', 'Add lang="en" or lang="ar" to <html>.'));
  else results.push(finding('pass', 'Language is declared', `Found lang="${lang}".`, 'Keep the page language aligned with its content.'));
  if (!dir && lang?.startsWith('ar')) results.push(finding('critical', 'Arabic direction is not explicit', 'Arabic content needs an explicit right-to-left base direction.', 'Add dir="rtl" to the document or component root.'));
  else if (dir) results.push(finding('pass', 'Text direction is explicit', `Found dir="${dir}".`, 'Keep mixed LTR content scoped with a direction override.'));
  const h1s = doc.querySelectorAll('h1');
  if (h1s.length !== 1) results.push(finding('critical', 'Heading structure needs review', `Expected one h1, found ${h1s.length}.`, 'Use one page-level h1, followed by ordered h2 and h3 headings.'));
  else results.push(finding('pass', 'Page has one h1', 'The page has a single top-level heading.', 'Preserve a meaningful heading hierarchy.'));
  const images = [...doc.querySelectorAll('img')];
  const missingAlt = images.filter((img) => !img.hasAttribute('alt'));
  if (missingAlt.length) results.push(finding('critical', 'Images need alternative text', `${missingAlt.length} image${missingAlt.length > 1 ? 's' : ''} has no alt attribute.`, 'Add descriptive alt text, or alt="" when the image is decorative.'));
  else results.push(finding('pass', 'Images have alt attributes', `${images.length} image${images.length === 1 ? '' : 's'} checked.`, 'Review whether each description communicates its purpose.'));
  const controls = [...doc.querySelectorAll('input, select, textarea, button')];
  const unlabeledInputs = controls.filter((el) => ['input','select','textarea'].includes(el.tagName.toLowerCase()) && !el.getAttribute('aria-label') && !(el.id && doc.querySelector(`label[for="${el.id}"]`)));
  if (unlabeledInputs.length) results.push(finding('critical', 'Form controls need labels', `${unlabeledInputs.length} control${unlabeledInputs.length > 1 ? 's' : ''} has no visible or programmatic label.`, 'Pair each control with a label or an aria-label that explains its purpose.'));
  else results.push(finding('pass', 'Controls are labeled', 'Inputs and selection controls have an associated label.', 'Keep labels visible where possible.'));
  const links = [...doc.querySelectorAll('a')];
  const vagueLinks = links.filter((link) => /^(click here|here|read more)$/i.test(link.textContent.trim()));
  if (vagueLinks.length) results.push(finding('warning', 'Link text is vague', `${vagueLinks.length} link uses context-dependent text.`, 'Replace “Click here” with a destination-specific label.'));
  const buttons = [...doc.querySelectorAll('button')];
  const iconButtons = buttons.filter((button) => !button.textContent.trim() && !button.getAttribute('aria-label'));
  if (iconButtons.length) results.push(finding('critical', 'Icon buttons need names', `${iconButtons.length} button${iconButtons.length > 1 ? 's' : ''} has no accessible name.`, 'Add aria-label="Describe the action" to icon-only buttons.'));
  const passed = results.filter((item) => item.level === 'pass').length;
  return { results, critical: results.filter((item) => item.level === 'critical').length, warning: results.filter((item) => item.level === 'warning').length, passed };
}

function render(report) {
  reportTitle.textContent = report.critical ? 'Actionable barriers found' : 'Baseline looks healthy';
  issueCount.textContent = `${report.critical + report.warning} review item${report.critical + report.warning === 1 ? '' : 's'}`;
  criticalCount.textContent = report.critical;
  warningCount.textContent = report.warning;
  passCount.textContent = report.passed;
  findingsEl.innerHTML = report.results.map((item) => `<article class="finding ${item.level}"><i class="finding-dot" aria-hidden="true"></i><div><h4>${escapeHtml(item.title)}</h4><p>${escapeHtml(item.detail)} <code>${escapeHtml(item.fix)}</code></p></div><b>${item.level}</b></article>`).join('');
}

scanButton?.addEventListener('click', () => render(scan(input.value)));
goodButton?.addEventListener('click', () => { input.value = goodSample; render(scan(input.value)); });
year.textContent = new Date().getFullYear();
