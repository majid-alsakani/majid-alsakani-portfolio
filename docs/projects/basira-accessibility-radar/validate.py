from pathlib import Path
import json

root = Path(__file__).parent
required = ['index.html', 'styles.css', 'app.js', 'README.md', 'docs/architecture.md', 'architecture.mmd']
errors = [path for path in required if not (root / path).exists()]
html = (root / 'index.html').read_text(encoding='utf-8')
for marker in ['Basira Accessibility Radar', 'id="scan"', 'id="findings"', 'app.js']:
    if marker not in html:
        errors.append(f'index.html missing {marker}')
if 'flowchart' not in (root / 'architecture.mmd').read_text(encoding='utf-8'):
    errors.append('architecture.mmd missing flowchart')
print(f'files_checked={len(required)}')
print(f'errors={len(errors)}')
for error in errors:
    print(error)
raise SystemExit(1 if errors else 0)
