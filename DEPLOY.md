# Deploying ARTH.AI — GitHub repo + live link

Everything is built, committed locally, and verified (production build clean,
all routes return 200, engine + DoWhy validation pass). These last steps need
**your** GitHub and Vercel logins (browser auth), so run them yourself — it
takes ~3 minutes.

## 1 · Push to GitHub (the repo link)

The app is fully static, so any of these works. Easiest is the GitHub CLI:

```bash
# install GitHub CLI once (https://cli.github.com), then:
gh auth login
gh repo create arth-ai --public --source . --remote origin --push
```

No CLI? Create an empty repo named `arth-ai` on github.com, then:

```bash
git remote add origin https://github.com/<your-username>/arth-ai.git
git branch -M main
git push -u origin main
```

## 2 · Deploy to Vercel (the live prototype link)

**Option A — dashboard (recommended, zero config):**
1. Go to https://vercel.com → **Add New → Project**
2. **Import** the `arth-ai` GitHub repo
3. Framework preset auto-detects **Next.js** — leave all defaults
4. **Deploy**. You get a live URL like `https://arth-ai.vercel.app` in ~1 min.

**Option B — CLI:**
```bash
npx vercel            # login in browser, accept defaults
npx vercel --prod     # promote to production → live link
```

No environment variables are required. The causal engine runs entirely in the
browser; nothing server-side or secret.

## 3 · For the submission form

- **GitHub repo:** `https://github.com/<your-username>/arth-ai`
- **Live prototype:** `https://arth-ai.vercel.app` (or your Vercel URL)
- **Idea write-up:** the top-level `README.md` is structured to double as the idea
  document (problem → causal insight → architecture → agents → methodology →
  compliance → business case).

## Local sanity check before pushing

```bash
npm install
npm run build         # must end "✓ Compiled successfully"
npm run dev           # open http://localhost:3000
npx tsx scripts/verify-engine.ts      # causal vs correlational benchmark
npx tsx scripts/verify-ablations.ts   # ablation + robustness
cd research && pip install -r requirements.txt && python causal_validation.py
```
