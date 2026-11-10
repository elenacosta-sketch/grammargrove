"""Export editable source without hosted records, credentials, or nested archives."""
from pathlib import Path
import zipfile
root=Path(__file__).resolve().parents[1]
target=root/'downloads/grammar-grove-github.zip'
target.parent.mkdir(exist_ok=True)
files=['package.json','package-lock.json','wrangler.jsonc','.gitignore','.openai/hosting.json','README.md','dist/index.html','dist/style.css','dist/data.js','dist/app.js']
files += [str(p.relative_to(root)) for directory in ['scripts','tests','content'] for p in (root/directory).rglob('*') if p.is_file() and '__pycache__' not in str(p)]
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for name in sorted(set(files)):
  path=root/name
  if path.exists():z.write(path,'grammar-grove/'+name)
 for name in ['index.html','style.css','data.js','app.js']:
  z.write(root/'dist'/name,'grammar-grove/'+name)
 z.writestr('grammar-grove/.nojekyll','')
with zipfile.ZipFile(target) as z:
 assert z.testzip() is None
print(f'Exported {target.name}: {target.stat().st_size:,} bytes')
