from pathlib import Path
root=Path(__file__).parent
required=['index.html','styles.css','app.js','README.md','architecture.mmd','assets/architecture.png']
errors=[name for name in required if not (root/name).exists()]
html=(root/'index.html').read_text(encoding='utf-8');js=(root/'app.js').read_text(encoding='utf-8')
for marker in ['id="trace"','id="evaluate"','id="output"']:
    if marker not in html: errors.append(marker)
for marker in ['function evaluate','JSON.parse','allow','duration_ms']:
    if marker not in js: errors.append(marker)
print(f'files_checked={len(required)}');print(f'errors={len(errors)}')
for error in errors: print(error)
raise SystemExit(bool(errors))
