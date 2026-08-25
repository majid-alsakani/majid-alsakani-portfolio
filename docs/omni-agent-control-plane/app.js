const runButton = document.querySelector('#run-task');
const runStatus = document.querySelector('#run-status');
const taskInput = document.querySelector('#task-input');
const modeSelect = document.querySelector('#mode');
const rows = [...document.querySelectorAll('.trace-row')];
const agentLines = [...document.querySelectorAll('.agent-line')];
const sampleTasks = [...document.querySelectorAll('.sample-task')];
const routeLabel = document.querySelector('#route-label');
const outputTitle = document.querySelector('#output-title');
const outputBadge = document.querySelector('#output-badge');
const outputSummary = document.querySelector('#output-summary');
const approvalLabel = document.querySelector('#approval-label');
const memoryLabel = document.querySelector('#memory-label');
const stateCode = document.querySelector('#state-code');
const year = document.querySelector('#year');
let running = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const routeValue = () => ({
  'Auto mode': 'auto',
  'Single-agent': 'single',
  'Multi-agent': 'multi',
}[modeSelect?.value] || 'auto');

function resetTrace() {
  rows.forEach((row) => {
    row.classList.remove('active', 'done');
    row.querySelector('.status-label').textContent = 'Waiting';
  });
  agentLines.forEach((line) => {
    line.querySelector('em').textContent = 'idle';
    line.querySelector('em').style.color = '';
  });
}

function setStep(name, state, label) {
  const row = document.querySelector(`[data-step="${name}"]`);
  if (!row) return;
  row.classList.toggle('active', state === 'active');
  row.classList.toggle('done', state === 'done');
  row.querySelector('.status-label').textContent = label;
}

function setAgent(name, state) {
  const line = agentLines.find((item) => item.querySelector('strong').textContent === name);
  if (!line) return;
  const label = line.querySelector('em');
  label.textContent = state;
  label.style.color = state === 'running' ? 'var(--blue)' : state === 'done' ? 'var(--mint)' : '';
}

function setOutput({ title, badge, summary, route, approval, memory, state }) {
  if (outputTitle) outputTitle.textContent = title;
  if (outputBadge) outputBadge.textContent = badge;
  if (outputSummary) outputSummary.textContent = summary;
  if (routeLabel) routeLabel.textContent = route;
  if (approvalLabel) approvalLabel.textContent = approval;
  if (memoryLabel) memoryLabel.textContent = memory;
  if (stateCode) stateCode.textContent = JSON.stringify(state, null, 2);
}

function resetOutput() {
  setOutput({
    title: 'Ready for a run',
    badge: 'Not started',
    summary: 'The result will appear here after the simulation completes. The state remains blocked from durable memory until approval.',
    route: modeSelect?.value || 'Auto mode',
    approval: 'Pending',
    memory: 'Blocked',
    state: {},
  });
}

function activeAgentsFor(mode) {
  return mode === 'single' ? ['Analyst'] : ['Researcher', 'Analyst', 'Risk Manager'];
}

async function runTask() {
  if (running || !runButton) return;
  running = true;
  const task = taskInput?.value.trim() || 'Review the submitted task';
  const mode = routeValue();
  const activeAgents = activeAgentsFor(mode);
  const routeName = modeSelect?.value || 'Auto mode';
  runButton.disabled = true;
  runButton.setAttribute('aria-busy', 'true');
  runButton.style.opacity = '.65';
  resetTrace();
  setOutput({
    title: 'Processing request',
    badge: 'Simulation running',
    summary: 'The control plane is moving through a bounded, inspectable lifecycle. Nothing is sent to an external service.',
    route: routeName,
    approval: 'Evaluating',
    memory: 'Blocked',
    state: { goal: task, mode, approval_status: 'pending', memory_write: 'blocked' },
  });
  runStatus.textContent = 'Running';
  setStep('planner', 'active', 'Planning');
  await sleep(520);
  setStep('planner', 'done', 'Complete');
  setStep('executor', 'active', 'Executing');
  activeAgents.forEach((agent) => setAgent(agent, 'running'));
  await sleep(850);
  activeAgents.forEach((agent) => setAgent(agent, 'done'));
  setStep('executor', 'done', 'Complete');
  setStep('critic', 'active', 'Reviewing');
  await sleep(650);
  setStep('critic', 'done', 'Complete');
  setStep('approval', 'active', 'Awaiting');
  runStatus.textContent = 'Human review';
  await sleep(650);
  setStep('approval', 'done', 'Ready');
  runStatus.textContent = 'Complete';
  setOutput({
    title: 'Reviewable result prepared',
    badge: 'Simulation complete',
    summary: `The ${routeName.toLowerCase()} path produced a structured result for “${task}”. The artifact is ready for a human decision; durable memory remains blocked.`,
    route: routeName,
    approval: 'Pending human review',
    memory: 'Blocked',
    state: {
      goal: task,
      mode,
      plan: ['typed task decomposition', 'bounded execution', 'contract review'],
      evidence: ['simulated evidence bundle'],
      tool_trace: activeAgents.map((agent) => ({ agent, status: 'complete', side_effect: false })),
      critique: ['contract complete', 'evidence review complete'],
      approval_status: 'pending',
      memory_write: 'blocked',
    },
  });
  runButton.disabled = false;
  runButton.removeAttribute('aria-busy');
  runButton.style.opacity = '';
  running = false;
}

runButton?.addEventListener('click', runTask);
modeSelect?.addEventListener('change', () => {
  if (!running && routeLabel) routeLabel.textContent = modeSelect.value;
});
taskInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runTask();
});
sampleTasks.forEach((sample) => {
  sample.addEventListener('click', () => {
    if (!taskInput || running) return;
    taskInput.value = sample.dataset.task || '';
    taskInput.focus();
  });
});
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', link.getAttribute('href'));
    }
  });
});
if (year) year.textContent = new Date().getFullYear();
resetOutput();
