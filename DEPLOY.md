# Deploying ARTH.AI

The app is a static Next.js site, so deployment is simple. It is already live at
**https://arth-ai-one.vercel.app**.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Verify before pushing

```bash
npm run build                          # must end "Compiled successfully"
npx next lint                          # should report no warnings or errors
npx tsx scripts/verify-engine.ts       # causal vs correlational benchmark
npx tsx scripts/verify-ablations.ts    # ablation + robustness studies
cd research && pip install -r requirements.txt && python causal_validation.py
```

## Deploy to Vercel

The project is connected to this GitHub repository, so every push to `main`
triggers an automatic deployment. To deploy manually:

```bash
npx vercel            # first run logs in via the browser
npx vercel --prod     # promotes the build to production
```

No environment variables are required. The causal engine runs entirely in the
browser, so there is nothing server-side or secret to configure.

## Submission links

- Live prototype: https://arth-ai-one.vercel.app
- Code repository: https://github.com/sahil0m/arth-ai
