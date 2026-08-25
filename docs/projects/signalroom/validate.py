from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).parent
required = [
    'index.html', 'styles.css', 'engine.js', 'app.js', 'README.md',
    'architecture.mmd', 'make-demo.sh', 'docs/architecture.md', 'docs/demo-storyboard.md',
    'assets/preview.webp', 'assets/architecture.png', 'assets/demo.mp4',
    'schemas/change-manifest.schema.json',
    'schemas/evidence-bundle.schema.json',
    'schemas/decision-report.schema.json',
    'fixtures/release-ready.json',
    'fixtures/release-held.json',
    'fixtures/incident-learn.json',
]
errors: list[str] = []
for item in required:
    if not (ROOT / item).is_file():
        errors.append(f'missing: {item}')
for schema in (ROOT / 'schemas').glob('*.json'):
    try:
        json.loads(schema.read_text())
    except json.JSONDecodeError as exc:
        errors.append(f'invalid json schema: {schema}: {exc}')
for fixture in (ROOT / 'fixtures').glob('*.json'):
    try:
        data = json.loads(fixture.read_text())
        if not isinstance(data, dict) or 'manifest' not in data:
            errors.append(f'invalid fixture shape: {fixture}')
    except json.JSONDecodeError as exc:
        errors.append(f'invalid fixture: {fixture}: {exc}')
html = (ROOT / 'index.html').read_text()
for marker in ('id="workbench"', 'id="replay-button"', 'id="export-json"', 'id="state-contract"'):
    if marker not in html:
        errors.append(f'missing html marker: {marker}')
for script in ('engine.js', 'app.js'):
    if f'src="{script}"' not in html:
        errors.append(f'missing script reference: {script}')
for asset in ('assets/preview.webp', 'assets/architecture.png', 'assets/demo.mp4'):
    if (ROOT / asset).stat().st_size == 0:
        errors.append(f'empty asset: {asset}')

print(f'files_checked={len(required)}')
print(f'errors={len(errors)}')
for error in errors:
    print(error)
raise SystemExit(1 if errors else 0)
