from pathlib import Path
import re
root=Path(__file__).parent
required=['index.html','styles.css','app.js','README.md','architecture.mmd','assets/architecture.png']
missing=[name for name in required if not (root/name).exists()]
html=(root/'index.html').read_text(encoding='utf-8')
js=(root/'app.js').read_text(encoding='utf-8')
errors=missing[:]
for marker in ['id="before"','id="after"','id="compare"','id="output"']:
    if marker not in html: errors.append(f'missing {marker}')
for marker in ['function compare','data-example','JSON.parse']:
    if marker not in js: errors.append(f'missing JS marker {marker}')
print(f'files_checked={len(required)}')
print(f'errors={len(errors)}')
for error in errors: print(error)
raise SystemExit(bool(errors))
