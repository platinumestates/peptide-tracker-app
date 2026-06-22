# Handoff: Peptide Tracker — persistent blank/black screen

**Date:** 2026-06-22
**Owner / contact:** GitHub account `platinumestates` (jkua@platinumestates.ca)
**Status:** UNRESOLVED. User still reports a black screen. Root cause **not yet
confirmed** because the engineers so far could not load the live site or see the
user's browser console (see "Critical missing data").

---

## TL;DR for whoever picks this up
The app **builds and renders correctly** in automated browser tests against the
exact production bundle — so this is very likely **not a code/render bug**. The
most probable remaining causes are (a) a **GitHub Pages serving/settings**
problem, (b) the user opening a **different URL** than what's deployed, or (c) a
runtime error specific to the **user's real device/data** that no one has
captured yet. The single highest-value next step is to **open the live URL in a
desktop browser with DevTools open and read the Console + Network tabs.** Nobody
has been able to do that yet.

---

## Project facts
- **Repo:** `platinumestates/peptide-tracker-app` (public)
- **Live URL (expected):** https://platinumestates.github.io/peptide-tracker-app/
- **Stack:** Vite 5, React 18, react-router-dom v6, `vite-plugin-pwa`, Tailwind 3
- **Routing:** `<BrowserRouter basename="/peptide-tracker-app">` (src/App.jsx)
- **Vite base:** `/peptide-tracker-app/` (vite.config.js)
- **Deploy:** GitHub Actions `.github/workflows/deploy.yml` → GitHub Pages
  (native Pages deployment via `actions/deploy-pages`, triggers on push to `main`)
- **Data model:** the app reads/writes the user's protocol/log JSON from a
  *separate* GitHub repo using a Personal Access Token + repo name the user
  enters in Settings (stored in `localStorage` as `pt_token` / `pt_repo`). See
  src/context/AppContext.jsx and src/services/github.js.
- **Default branch:** `main`. Work branch used: `claude/tender-cori-aswhjd`.
- **Current `main` HEAD:** `d91b951` (all changes below are merged & deployed green).

## What was changed & deployed (all merged to main, all deploys succeeded)
1. **PR #1** — SPA 404 fallback (`public/404.html` + restore snippet in
   `index.html`) for deep-link routing; **ErrorBoundary** (src/components/
   ErrorBoundary.jsx) so a render crash shows a recovery screen instead of a
   blank page; guarded an unguarded `protocol.peptides.find` in Dashboard.
2. **PR #2** — self-heal **watchdog** in `index.html`: if `#root` is empty 10s
   after load, unregister SW + clear caches + reload once per session.
3. **PR #3** — **`selfDestroying: true`** in `vite-plugin-pwa` (vite.config.js):
   deployed `sw.js` now unregisters any existing service worker, deletes its
   caches, and reloads clients. Intended to auto-recover devices stuck on a
   stale worker without manual cache clearing.

## What has been verified / ruled out
- ✅ `npm run build` succeeds; `npm run preview` serves the bundle.
- ✅ Headless Chromium (Playwright) against the **production build** renders
  correctly in every state tested:
  - fresh visitor (no token) → "Get Started" screen,
  - logged-in (token+repo in localStorage) → full dashboard, **even when the
    GitHub data fetch fails** (graceful, no crash),
  - **under full service-worker control** (`navigator.serviceWorker.controller`
    active) → still renders, no page errors.
- ✅ No code path reproduced a blank/black screen.
- ✅ No deploys occurred in the ~2 days before the issue was first reported
  (only the original 2026-04-08 build was live until today's fixes) — i.e. the
  breakage was **not** caused by a code change/deploy.
- ✅ Repo is **public** (`"private": false`), so the earlier 403 seen from the
  automation sandbox was the sandbox's egress block, not necessarily the real
  site state.

## Critical missing data (BLOCKERS — get these first)
The automation environment could **not** reach the live site: outbound network
is restricted ("Host not in allowlist: platinumestates.github.io"), and even the
headless browser's external requests were TLS-intercepted
(`ERR_CERT_AUTHORITY_INVALID`). So **no one has actually observed the live page
or the user's console.** You must collect:

1. **Live page in desktop Chrome/Edge with DevTools open:**
   - **Console tab:** copy any red errors verbatim.
   - **Network tab:** reload; check the main document response, and whether
     `assets/index-*.js` and `assets/index-*.css` return **200** (not 404/403).
     A 404 on the hashed JS = blank screen.
   - **View source** (Ctrl+U): confirm it contains
     `<script type="module" ... src="/peptide-tracker-app/assets/index-*.js">`.
2. **Exact URL the user opens** (bookmark/home-screen). Confirm it is
   `https://platinumestates.github.io/peptide-tracker-app/` and not an old
   custom domain or a path without the `/peptide-tracker-app/` base.
3. **Repo → Settings → Pages:** Source (must be **"GitHub Actions"**), any
   **custom domain**, **Enforce HTTPS** status, and the **last deployment**
   result/URL. (This could not be checked via API by the automation.)
4. With the new ErrorBoundary deployed, if the app crashes it now shows a
   visible "Something went wrong" + error text. **Ask the user to screenshot
   whatever is actually on screen** (truly black? a message? a spinner?).

## Leading hypotheses (in priority order)
1. **GitHub Pages misconfiguration / wrong source or custom domain** — would
   serve a blank/404 regardless of code. *Check item #3 above.*
2. **User visiting a stale/incorrect URL** (old domain, missing base path,
   cached bookmark). *Check item #2.*
3. **Device-/data-specific runtime error** not reproduced with a fake token —
   e.g. the user's real `protocol.json`/`cycles.json`/`inventory.json` shape
   triggers a throw the headless test didn't hit. The ErrorBoundary should now
   surface this; *get the console/screenshot (items #1, #4).*
4. **Stale service worker** (the theory PR #2/#3 targeted). If items above are
   clean and it's still blank, confirm in DevTools → Application → Service
   Workers what worker is active and whether the self-destroying one took over.

## How to reproduce / work locally
```bash
git clone https://github.com/platinumestates/peptide-tracker-app
cd peptide-tracker-app
npm ci
npm run build && npm run preview   # serves at /peptide-tracker-app/ base
# or: npm run dev
```
Deploy = merge to `main` (GitHub Actions publishes to Pages automatically).

## Access the next engineer needs (to be granted by the owner — NOT included here)
> Credentials/tokens are intentionally **not** in this document. Request them
> directly from the owner (`platinumestates` / jkua@platinumestates.ca) over a
> secure channel.
- **Collaborator + admin** on `platinumestates/peptide-tracker-app` (admin is
  required to view/modify **Settings → Pages**).
- A device or a screen-share with the user to capture the **live console**, or
  ask the user to send DevTools screenshots.
- Only if investigating data-driven crashes (hypothesis #3): the **data repo
  name** the app syncs to and a **GitHub PAT** — shared securely by the owner,
  used locally, never committed.

## Do NOT
- Re-attempt the original "pin Babel/React CDN in index.html" instructions —
  that was for a *different* project; this app has no CDN scripts.
- Reopen PRs #1–#3 (merged) for the same changes.
