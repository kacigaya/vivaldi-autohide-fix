<p align="center">
  <img src="assets/logo.png" alt="Vivaldi Auto-Hide Fix logo" width="140">
</p>

<h1 align="center">Vivaldi Auto-Hide Fix</h1>

<p align="center">
  <strong>Closes Vivaldi sidebars left open after switching windows.</strong><br>
  <em>Experimental patch for macOS Vivaldi 8.2.4133.52.</em>
</p>

<p align="center">
  <img alt="Vivaldi 8.2.4133.52" src="https://shieldcn.dev/badge/Vivaldi-8.2.4133.52-ef3939.svg?variant=secondary&amp;logo=vivaldi">
  <img alt="macOS" src="https://shieldcn.dev/badge/macOS-only-171717.svg?variant=secondary&amp;logo=apple">
  <a href="https://bun.sh"><img alt="Bun" src="https://shieldcn.dev/badge/Bun-runtime-fbf0df.svg?variant=secondary&amp;logo=bun&amp;logoColor=171717"></a>
</p>

## What it does

When you switch away from a Vivaldi window, auto-hidden sidebars can stay open. This patch updates Vivaldi's window-focus handler to:

- Close unpinned left and right sidebars when the window loses focus.
- Reset the hotspot state so sidebars do not remain expanded.
- Keep pinned sidebars and top or bottom bars unchanged.
- Back up `bundle.js` before writing and refuse to overwrite unexpected changes.

## Requirements

- macOS with Vivaldi 8.2.4133.52 installed at `/Applications/Vivaldi.app`
- [Bun](https://bun.sh) (no external packages needed)

## Usage

Quit Vivaldi before applying or restoring the patch.

1. Verify that your installed bundle matches:
   ```bash
   bun patch.js check
   ```

2. Apply the patch:
   ```bash
   bun patch.js apply
   ```
   The script creates a backup at `bundle.js.autohide-original` in the same directory.

3. To undo changes:
   ```bash
   bun patch.js restore
   ```

Restore the backup before updating Vivaldi, as browser updates replace `bundle.js`.

### Verification

After applying the patch:

1. Open two Vivaldi windows.
2. Hover over a sidebar in the first window so it opens, then click into the second window. The sidebar in the first window should close.
3. Confirm that pinned sidebars remain visible, hover opening still works, and tabs and address bar inputs behave normally.

## Built-in timing controls

Vivaldi includes hidden settings that speed up auto-hide animations without patching files:

1. Open Settings and search for `biscuit`.
2. Under **Auto-Hide**, set **Close delay** to `100 ms` (default is `800 ms`).
3. Set **Closing animation speed** to `100 ms` (default is `300 ms`).

This drops hiding latency from roughly 1.1 seconds to 0.2 seconds. These settings complement the patch, but you must set them manually.

## How it works

Vivaldi's window-focus reducer updates the window's `active` flag when focus changes, but leaves hover and hotspot states untouched when a window blurs. If a sidebar is expanded when focus shifts, it stays open.

`patch.js` targets that single handler in Vivaldi's `bundle.js`. On blur (`!i`), it sets `hotSpotStatus: "away"` and marks unpinned left and right sidebars as hidden (`visible: false`).

Before writing, `patch.js` confirms the target code occurs exactly once. If the snippet is missing, duplicated, or already modified, the script aborts without modifying the bundle.

## Development

```bash
bun test             # run unit tests
bun patch.js check   # verify against the local Vivaldi install
```

| File | Purpose |
| --- | --- |
| `patch.js` | CLI for checking, applying, and restoring the patch |
| `patch.test.js` | Tests for state transitions and bundle replacement safety |

## Caveats

This patch only handles sidebars left open when switching windows. It does not fix sidebars that stick while a window remains active.

Modifying files inside `Vivaldi.app` breaks the macOS code signature. Depending on your system security configuration, macOS Gatekeeper may warn about or refuse to open the modified application.

Browser updates will overwrite `bundle.js`. Run `bun patch.js check` after updating to verify whether the patch still matches.
