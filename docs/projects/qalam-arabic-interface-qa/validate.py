from pathlib import Path
root=Path(__file__).parent
required=['index.html','styles.css','app.js','README.md','docs/architecture.md','architecture.mmd']
errors=[p for p in required if not (root/p).exists()]
html=(root/'index.html').read_text(encoding='utf-8')
for marker in ['Qalam Arabic Interface QA','dir="rtl"','id="inspect"','id="findings"','app.js']:
    if marker not in html: errors.append(marker)
if 'flowchart' not in (root/'architecture.mmd').read_text(encoding='utf-8'): errors.append('flowchart')
print(f'files_checked={len(required)}');print(f'errors={len(errors)}');[print(e) for e in errors];raise SystemExit(bool(errors))
