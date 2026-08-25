const runButton = document.querySelector('#run-task');
const runStatus = document.querySelector('#run-status');
const taskInput = document.querySelector('#task-input');
const rows = [...document.querySelectorAll('.trace-row')];
const agentLines = [...document.querySelectorAll('.agent-line')];
let running = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

async function runTask() {
  if (running) return;
  running = true;
  runButton.disabled = true;
  runButton.style.opacity = '.65';
  resetTrace();
  runStatus.textContent = 'Running';
  setStep('planner', 'active', 'Planning');
  await sleep(700);
  setStep('planner', 'done', 'Complete');
  setStep('executor', 'active', 'Executing');
  setAgent('Researcher', 'running');
  setAgent('Analyst', 'running');
  setAgent('Risk Manager', 'running');
  await sleep(1100);
  setAgent('Researcher', 'done');
  setAgent('Analyst', 'done');
  setAgent('Risk Manager', 'done');
  setStep('executor', 'done', 'Complete');
  setStep('critic', 'active', 'Reviewing');
  await sleep(850);
  setStep('critic', 'done', 'Complete');
  setStep('approval', 'active', 'Awaiting');
  runStatus.textContent = 'Human review';
  await sleep(950);
  setStep('approval', 'done', 'Ready');
  runStatus.textContent = 'Complete';
  runButton.disabled = false;
  runButton.style.opacity = '';
  running = false;
}

runButton.addEventListener('click', runTask);
taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') runTask();
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
