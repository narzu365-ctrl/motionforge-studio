# MotionForge Studio — Version 2 Cloud Renderer

## Included
- `frontend/`: updated GitHub Pages app with Cloud API URL, private token, Test server, Cloud and Hybrid modes.
- `render-server/`: Dockerized Node.js + Playwright/Chromium + FFmpeg renderer.

## 1. Update GitHub Pages
Upload the contents of `frontend/` to the root of your existing `motionforge-studio` repository, replacing `index.html`, `styles.css`, and `app.js`. Commit changes. GitHub Pages will redeploy automatically.

## 2. Deploy cloud renderer
You need a separate Docker-capable web-service host. GitHub Pages cannot run Node.js, Chromium or FFmpeg. Deploy `render-server/` as a Docker service. If deploying from the full repository, set Dockerfile path to `render-server/Dockerfile`. If deploying the contents of this folder as a separate repository, use `Dockerfile`.

Set environment variables in the hosting dashboard:
- `API_TOKEN`: long random secret, at least 24 characters. Keep private.
- `ALLOWED_ORIGIN`: exact origin of your GitHub Pages site, e.g. `https://YOUR-USERNAME.github.io` (no path or trailing slash).
- `MAX_CONCURRENT=1`
- `MAX_FRAMES=1800`
- `PORT`: host usually provides this; default 8080.

## 3. Connect
In MotionForge: select Cloud or Hybrid, enter the cloud service base URL only (no `/render`), enter the same API_TOKEN, press Save settings, then Test server. Start with 1080p, 30 FPS, 5 seconds, then test 4K.

## Limits
Dimensions up to 3840, FPS 24/25/30/50/60, duration 3–60 seconds, total frames limited by MAX_FRAMES. Default 1800 means 4K/30fps up to 60 seconds or 4K/60fps up to 30 seconds. 4K rendering is CPU/disk intensive; free hosts may sleep, throttle or time out. Longer jobs may need paid hosting and asynchronous job polling.

## Animation compatibility
The renderer advances CSS/Web Animations API timelines frame-by-frame. JavaScript animations driven by Date.now(), performance.now() or wall-clock requestAnimationFrame may not be deterministic unless rewritten to use a shared timeline. No audio is rendered. External fonts/images may fail; embed licensed assets where possible.

## Security
API token authentication, CORS allowlisting, basic private-IP URL blocking, input limits and temporary-file cleanup are included. This is a starter, not a security-audited public service. Keep it private until reviewed; add stricter egress controls, queueing, rate limits and monitoring before public use. Frontend stores the token in localStorage on that device. Do not enter it on an untrusted device.

## Adobe Stock
Export settings do not guarantee acceptance. Inspect codec, dimensions, FPS, duration, artifacts, originality and commercial licensing. Avoid logos, trademarks, copyrighted characters and unlicensed assets.
