const scenarios = {
  'release-ready': { label: 'Release ready', file: 'fixtures/release-ready.json' },
  'release-held': { label: 'Release held', file: 'fixtures/release-held.json' },
  'incident-learn': { label: 'Incident learn', file: 'fixtures/incident-learn.json' }
};
let currentInput = null;
let currentResult = null;
let detailsOpen = false;

const $ = selector => document.querySelector(selector);

function setText(selector, value) { $(selector).textContent = value; }
function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}
function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = name; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}
function render(result) {
  currentResult = result;
  const bundle = result.bundle;
  const decisionKey = result.decision.toLowerCase();
  setText('#change-environment', bundle.manifest.environment.toUpperCase());
  setText('#change-summary', bundle.manifest.summary);
  setText('#change-service', `${bundle.manifest.service} · ${bundle.manifest.commit}`);
  setText('#change-author', bundle.manifest.author);
  setText('#change-files', bundle.manifest.files.length);
  $('#file-list').innerHTML = bundle.manifest.files.map(file => `<div class="file-item"><span>${escapeHtml(file.path)}</span><span>${escapeHtml(file.kind)} · ${escapeHtml(file.risk)}</span></div>`).join('');
  const orb = $('#decision-orb');
  orb.className = `decision-orb ${decisionKey}`;
  setText('#decision-value', result.decision.toUpperCase());
  setText('#decision-score', `${result.score} / 100`);
  setText('#decision-summary', result.summary);
  setText('#blocker-count', result.blockers);
  setText('#warning-count', result.warnings);
  setText('#evidence-count', result.findings.length);
  const evidence = [
    { icon: 'T', title: 'Test evidence', detail: `${result.totals.tests} recorded test(s)`, ok: result.totals.tests > 0 && !result.findings.some(f => f.id === 'tests-critical-failure') },
    { icon: '↗', title: 'Trace evidence', detail: `${result.totals.traces} trace event(s) · ${result.totals.aggregateTraceMs} ms`, ok: result.totals.traces > 0 && !result.findings.some(f => f.id === 'policy-tool-block') },
    { icon: 'A', title: 'Alert timeline', detail: `${result.totals.alerts} alert(s) attached`, ok: result.totals.alerts === 0 || !result.findings.some(f => f.id === 'alerts-critical') },
    { icon: 'C', title: 'Contract evidence', detail: String(bundle.apiContract.status || 'not-applicable'), ok: bundle.apiContract.status !== 'breaking' }
  ];
  $('#evidence-list').innerHTML = evidence.map(item => `<div class="evidence-item ${item.ok ? '' : 'warning'}"><span class="evidence-icon">${item.icon}</span><div><strong>${item.title}</strong><small>${escapeHtml(item.detail)}</small></div><b>${item.ok ? 'PRESENT' : 'REVIEW'}</b></div>`).join('');
  const hasBlocking = result.blockers > 0;
  $('#map-status').textContent = hasBlocking ? 'REVIEW NEEDED' : result.warnings ? 'FOLLOW-UP' : 'ALL PRESENT';
  $('#map-status').className = `status-dot ${hasBlocking ? 'bad' : result.warnings ? 'warn' : 'good'}`;
  $('#findings-list').innerHTML = result.findings.map(item => `<div class="finding-item ${item.severity}"><span class="evidence-icon">${item.severity === 'blocking' ? '!' : item.severity === 'warning' ? '△' : '✓'}</span><div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.evidence)}</small><div class="finding-detail"><b>Action:</b> ${escapeHtml(item.action)}</div></div><span class="finding-sev">${item.severity.toUpperCase()}</span></div>`).join('');
  $('#findings-list').parentElement.classList.toggle('details', detailsOpen);
  $('#state-contract').textContent = JSON.stringify({ decision: result.decision, score: result.score, blockers: result.blockers, warnings: result.warnings, evidence: 'local-only', changeId: bundle.manifest.id }, null, 2);
  $('#run-status').textContent = `Evaluated locally · ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}
async function loadScenario(key) {
  document.querySelectorAll('.scenario').forEach(button => button.classList.toggle('active', button.dataset.scenario === key));
  const response = await fetch(scenarios[key].file);
  currentInput = await response.json();
  render(evaluateBundle(currentInput));
}
function runReplay() {
  const button = $('#replay-button');
  button.disabled = true;
  $('#run-status').textContent = 'Replaying local evidence loop…';
  document.body.classList.add('is-running');
  setTimeout(() => {
    render(evaluateBundle(currentInput));
    $('#run-status').textContent = `Replay complete · ${currentResult.findings.length} signals inspected`;
    button.disabled = false;
    document.body.classList.remove('is-running');
  }, 650);
}
document.querySelectorAll('.scenario').forEach(button => button.addEventListener('click', () => loadScenario(button.dataset.scenario)));
$('#replay-button').addEventListener('click', runReplay);
$('#toggle-details').addEventListener('click', () => { detailsOpen = !detailsOpen; $('#findings-list').parentElement.classList.toggle('details', detailsOpen); });
$('#export-json').addEventListener('click', () => currentResult && download(`${currentResult.bundle.manifest.id}-review.json`, JSON.stringify(buildReviewBundle(currentResult), null, 2), 'application/json'));
$('#export-md').addEventListener('click', () => currentResult && download(`${currentResult.bundle.manifest.id}-review.md`, resultToMarkdown(currentResult), 'text/markdown'));
$('#import-file').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { currentInput = JSON.parse(reader.result); render(evaluateBundle(currentInput)); $('#run-status').textContent = 'Imported and evaluated locally.'; }
    catch { $('#run-status').textContent = 'Import failed: invalid JSON.'; }
  };
  reader.readAsText(file);
});
loadScenario('release-ready');
