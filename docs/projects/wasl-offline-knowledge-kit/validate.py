from pathlib import Path
root=Path(__file__).parent
required=['index.html','styles.css','app.js','README.md','manifest.json','sw.js','docs/architecture.md','architecture.mmd']
errors=[p for p in required if not (root/p).exists()]
html=(root/'index.html').read_text(encoding='utf-8')
for marker in ['Wasl Offline Knowledge Kit','id="search"','id="notes"','manifest.json','app.js']:
    if marker not in html: errors.append(marker)
if 'serviceWorker' not in (root/'app.js').read_text(encoding='utf-8'): errors.append('serviceWorker')
print(f'files_checked={len(required)}');print(f'errors={len(errors)}');[print(e) for e in errors];raise SystemExit(bool(errors))
