# MotionForge — HTML to MP4 Video Studio

A GitHub Pages-ready starter project for creating original HTML/CSS/SVG motion graphics and exporting browser recordings as WebM or H.264 MP4. Includes an optional cloud-render API connection for more dependable high-resolution output.

## 1. Publish on GitHub Pages

1. Create a new public GitHub repository, for example `motionforge-studio`.
2. Upload `index.html`, `styles.css`, `app.js`, `.nojekyll`, and this README to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then Save.
6. Wait for deployment. Your site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

The project is static; no build step is required. Use HTTPS (GitHub Pages provides it), because browser screen capture requires a secure context.

## 2. Browser export

Choose **Browser capture + MP4 conversion** (or Hybrid without a configured cloud server), then click Export MP4.

1. Chrome asks you to share a screen, window, or tab.
2. Before exporting, click **Open clean render tab** beside the preview. In the share dialog, select that separate tab (the animation only), not the MotionForge editor tab.
3. Keep the tab visible and do not minimize or switch away during recording.
4. When recording finishes, FFmpeg.wasm converts the captured WebM into H.264 MP4 and downloads it.

Important limitations:
- Browser capture records the visible tab. It is not a deterministic frame-by-frame renderer.
- The clean preview tab contains only the animation, not the editor controls. The browser may capture at a lower resolution or frame rate than requested. A 4K setting is an output target, not a guarantee that the capture source is native 4K.
- FFmpeg.wasm can use substantial RAM and CPU. Long 4K/60fps conversions may fail on phones or low-memory devices.
- The tab must remain visible. Mobile browsers may not support tab capture or may pause rendering in the background.
- Browser mode is best for quick drafts and tests. Inspect actual file properties before stock submission.

## 3. Cloud rendering (recommended for reliable 4K)

The frontend sends a JSON POST request to the endpoint configured under **Cloud render API URL**.

Request:
```json
{
  "html": "<!doctype html>...",
  "width": 3840,
  "height": 2160,
  "fps": 30,
  "duration": 10,
  "format": "mp4",
  "quality": 21,
  "background": "keep"
}
```

The endpoint can respond in either of these ways:

**A. Direct file response:** return the MP4/WebM bytes with an appropriate `Content-Type`.

**B. JSON response:**
```json
{
  "downloadUrl": "https://your-server.example.com/files/job-123.mp4",
  "filename": "abstract-motion-4k.mp4"
}
```

For Hybrid mode, the app tries the cloud endpoint first and falls back to browser capture if the cloud request fails.

### Cloud server security checklist
- Use HTTPS.
- Validate dimensions, FPS and duration on the server. Enforce reasonable maximums.
- Restrict allowed origins with CORS to your own GitHub Pages domain.
- Add authentication or a private token before exposing a public rendering service; do not put secret API keys in `app.js` or GitHub.
- Sanitize/contain untrusted HTML in an isolated browser context. Do not run arbitrary user HTML on a server that has access to private files or internal network services.
- Rate-limit requests and cap job size/time.
- Store rendered files temporarily and delete them automatically.
- A production cloud service needs a queue, job status endpoint, storage and monitoring.

## 4. Suggested cloud stack

A separate Node.js service can use Playwright/Chromium to load HTML at the requested viewport and FFmpeg to encode a sequence of frames. Deploy it on a VPS/container with adequate CPU, RAM and disk. The GitHub Pages site is only the frontend; GitHub Pages cannot run FFmpeg, Node.js or server-side rendering jobs.

This repository intentionally does not include a public, unauthenticated render server. Deploying one safely requires server credentials, resource limits and hosting.

## 5. Creating stock-ready content

The starter templates are examples, not finished stock assets. Before submitting:
- Make each animation genuinely original; do not mass-produce near-identical color/shape variants.
- Remove accidental text errors, visual glitches, flicker, banding, compression artifacts and unwanted borders.
- Ensure all fonts, music, footage, SVGs and other assets are licensed for commercial stock distribution.
- Do not use trademarks, logos, copyrighted characters or misleading metadata.
- Check the marketplace's current video specifications and inspect the exported file's actual codec, dimensions, FPS, duration and visual quality. Export settings alone do not guarantee acceptance.
- Keep a high-quality master and avoid repeated lossy re-encoding.

## 6. Files

- `index.html` — application layout
- `styles.css` — responsive dark studio interface
- `app.js` — templates, preview, browser recording, FFmpeg conversion and cloud API integration
- `.nojekyll` — GitHub Pages helper

## Troubleshooting

**FFmpeg fails to load:** Check internet access and allow the unpkg CDN. The FFmpeg core files are downloaded at runtime.

**Screen share does not show the animation:** Choose the tab containing MotionForge, not another app/window. Keep it visible.

**MP4 export is slow or fails on mobile:** Try 1080p, 24/30 FPS, shorter duration, or use a cloud rendering server.

**Cloud mode fails:** Check the API URL, HTTPS, CORS, server logs and response contract described above.
