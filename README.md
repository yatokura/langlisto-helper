# Langlisto Auto Focus

Tiny Chrome extension for [app.langlisto.com](https://app.langlisto.com). No build step, no deps, just vibes.

- answered it right? next input gets focus automatically
- messed up? it yanks you back to the wrong one so you can fix it fast
- hitting Enter on an empty field does nothing (no more accidental skips)

## Install

1. Open `chrome://extensions` and flip on **Developer mode**
2. Click **Load unpacked** and point it at this folder
3. go grind some exercises, done

## What's inside

- `manifest.json` — the extension glue, MV3, only runs on app.langlisto.com
- `content.js` — all the actual logic, watches the DOM and moves focus around

That's it, two files, ship it.
