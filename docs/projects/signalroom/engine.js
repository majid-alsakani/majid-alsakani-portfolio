const DECISIONS = Object.freeze({ RELEASE: 'Release', HOLD: 'Hold', LEARN: 'Learn' });

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeBundle(input) {
  const raw = input && typeof input === 'object' ? input : {};
  const manifest = raw.manifest && typeof raw.manifest === 'object' ? raw.manifest : {};
  return {
    manifest: {
      id: String(manifest.id || 'unidentified-change'),
      service: String(manifest.service || 'unknown-service'),
      environment: String(manifest.environment || 'staging'),
      commit: String(manifest.commit || 'unknown'),
      author: String(manifest.author || 'unknown'),
      summary: String(manifest.summary || 'Unspecified change'),
      files: asArray(manifest.files)
    },
    tests: asArray(raw.tests),
    traces: asArray(raw.traces),
    alerts: asArray(raw.alerts),
    apiContract: raw.apiContract && typeof raw.apiContract === 'object' ? raw.apiContract : { status: 'not-applicable' }
  };
}

function finding(id, severity, category, title, evidence, action) {
  return { id, severity, category, title, evidence, action };
}

function evaluateBundle(input) {
  const bundle = normalizeBundle(input);
  const findings = [];
  const failedTests = bundle.tests.filter(test => test.status === 'failed');
  const criticalFailedTests = failedTests.filter(test => test.critical !== false);
  const blockedTools = bundle.traces.filter(trace => trace.status === 'blocked' || trace.allowlisted === false);
  const brokenContract = bundle.apiContract.status === 'breaking';
  const criticalAlerts = bundle.alerts.filter(alert => alert.severity === 'critical');
  const warningAlerts = bundle.alerts.filter(alert => alert.severity === 'warning');
  const totalTraceMs = bundle.traces.reduce((total, trace) => total + Number(trace.durationMs || 0), 0);

  if (criticalFailedTests.length) {
    findings.push(finding('tests-critical-failure', 'blocking', 'tests', 'Critical test failure', `${criticalFailedTests.length} critical test(s) failed`, 'Fix or explicitly waive the failure before release.'));
  } else if (failedTests.length) {
    findings.push(finding('tests-noncritical-failure', 'warning', 'tests', 'Non-critical test failure', `${failedTests.length} test(s) failed`, 'Review the failure and record an owner.'));
  } else if (bundle.tests.length) {
    findings.push(finding('tests-covered', 'info', 'tests', 'Test evidence present', `${bundle.tests.length} test(s) passed or were recorded`, 'Keep the evidence attached to the change.'));
  } else {
    findings.push(finding('tests-missing', 'blocking', 'tests', 'No test evidence', 'The bundle contains no test result', 'Attach at least one relevant test result.'));
  }

  if (brokenContract) {
    findings.push(finding('contract-breaking', 'blocking', 'contract', 'API contract marked breaking', String(bundle.apiContract.evidence || 'No compatibility evidence'), 'Review migration, deprecation, or rollback plan.'));
  } else if (bundle.apiContract.status === 'compatible') {
    findings.push(finding('contract-compatible', 'info', 'contract', 'API contract evidence present', String(bundle.apiContract.evidence || 'Compatible snapshot'), 'Keep the contract check in the review bundle.'));
  }

  if (blockedTools.length) {
    const names = blockedTools.map(trace => trace.tool || 'unknown-tool').join(', ');
    findings.push(finding('policy-tool-block', 'blocking', 'policy', 'Tool policy violation', `${blockedTools.length} blocked or non-allowlisted tool call(s): ${names}`, 'Add an approved tool or route the action through human approval.'));
  } else if (bundle.traces.length) {
    findings.push(finding('policy-clean', 'info', 'policy', 'Tool policy evidence clean', `${bundle.traces.length} trace event(s), ${totalTraceMs} ms aggregate`, 'Retain trace identifiers for replay.'));
  } else {
    findings.push(finding('traces-missing', 'warning', 'traces', 'No trace evidence', 'The bundle contains no trace event', 'Attach a trace or state why this change has no runtime path.'));
  }

  if (criticalAlerts.length) {
    findings.push(finding('alerts-critical', 'blocking', 'alerts', 'Critical alert correlated', `${criticalAlerts.length} critical alert(s) attached`, 'Hold release and complete incident review.'));
  } else if (warningAlerts.length) {
    findings.push(finding('alerts-warning', 'warning', 'alerts', 'Warning alert correlated', `${warningAlerts.length} warning alert(s) attached`, 'Review the timeline and record whether it is expected.'));
  } else {
    findings.push(finding('alerts-clear', 'info', 'alerts', 'No alert evidence attached', 'The bundle contains no alert event', 'Keep the absence explicit; it is not proof of no impact.'));
  }

  const blockers = findings.filter(item => item.severity === 'blocking').length;
  const warnings = findings.filter(item => item.severity === 'warning').length;
  let decision = DECISIONS.RELEASE;
  let summary = 'Evidence is present and no blocking signal was detected.';
  if (blockers) {
    decision = DECISIONS.HOLD;
    summary = `${blockers} blocking signal(s) require human review before release.`;
  } else if (warnings || bundle.alerts.length) {
    decision = DECISIONS.LEARN;
    summary = 'The change is not blocked, but the evidence should become a regression or follow-up item.';
  }
  const score = Math.max(0, Math.min(100, 100 - (blockers * 28) - (warnings * 10)));
  return {
    decision,
    score,
    summary,
    blockers,
    warnings,
    findings,
    totals: {
      tests: bundle.tests.length,
      traces: bundle.traces.length,
      alerts: bundle.alerts.length,
      files: bundle.manifest.files.length,
      aggregateTraceMs: totalTraceMs
    },
    bundle
  };
}

function buildReviewBundle(result) {
  return {
    generatedAt: new Date().toISOString(),
    tool: 'SignalRoom MVP',
    decision: result.decision,
    score: result.score,
    summary: result.summary,
    change: result.bundle.manifest,
    totals: result.totals,
    findings: result.findings
  };
}

function resultToMarkdown(result) {
  const lines = [
    `# SignalRoom review — ${result.bundle.manifest.id}`,
    '',
    `- Decision: **${result.decision}**`,
    `- Score: **${result.score}/100**`,
    `- Service: ${result.bundle.manifest.service}`,
    `- Commit: ${result.bundle.manifest.commit}`,
    '',
    result.summary,
    '',
    '## Findings',
    ''
  ];
  result.findings.forEach(item => {
    lines.push(`### ${item.severity.toUpperCase()} · ${item.title}`);
    lines.push(`- Category: ${item.category}`);
    lines.push(`- Evidence: ${item.evidence}`);
    lines.push(`- Action: ${item.action}`);
    lines.push('');
  });
  lines.push('## Boundary');
  lines.push('This report is a deterministic local MVP output. It is not proof of production safety, causal diagnosis, rollback success, or customer impact reduction.');
  return lines.join('\n');
}

if (typeof module !== 'undefined') module.exports = { DECISIONS, normalizeBundle, evaluateBundle, buildReviewBundle, resultToMarkdown };
