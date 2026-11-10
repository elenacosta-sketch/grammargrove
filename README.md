# Grammar Grove

A practice-only grammar website with a social-style feed, topic stories, swipeable reels, 33 topics, 429 examples, six activity formats, XP and saved favorites.

Enrollment, sign-in, class management and student workspaces have been removed. Practice progress and favorites are stored in the current browser. No student records are read, created or deleted by this version.

## Publish on GitHub Pages

1. Extract the ZIP.
2. Upload the contents of `grammar-grove/` into the repository root, replacing matching files.
3. Ensure `index.html`, `style.css`, `data.js` and `app.js` are at the repository root. Include `.nojekyll` if possible.
4. In GitHub, open Settings → Pages and choose Deploy from a branch, your main branch, and `/ (root)`.
5. Save, then wait for deployment to finish.

The root files use relative asset links and work under a project URL such as `/grammargrove/`. GitHub Pages needs no Supabase project, account system or backend for this practice-only version.

## Edit and build

The editable frontend source is in `dist/`. The ZIP also includes matching root files for simple GitHub Pages uploads. If editing directly in GitHub for Pages, edit the root files. For the Worker build, edit `dist/` and run:

```sh
python3 scripts/build.py
node tests/practice.mjs
```

The build creates `worker/index.js` and `dist/server/index.js`. Existing ChatGPT Sites hosting keeps its existing access policy. Its unused storage binding is preserved to avoid affecting historical records, but this application has no classroom API routes.

## Optional Cloudflare deployment

```sh
npm ci
npx wrangler login
npm run deploy:cloudflare
```

`wrangler.jsonc` configures a practice-only Worker without account or storage dependencies.

## Refresh the ZIP

```sh
python3 scripts/export-github.py
python3 scripts/build.py
```

Exports include source and GitHub Pages entry files, without Git history, credentials, student records or nested ZIP archives.
