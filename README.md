<h1 align="center">Vivaldi Auto-Hide Fix</h1>

<p align="center">
  <strong>A local patch for Vivaldi sidebars that stay open after switching windows.</strong><br>
  <em>Experimental candidate fix for macOS Vivaldi 8.2.4133.52 only.</em>
</p>

<p align="center">
  <img alt="Vivaldi 8.2.4133.52" src="https://shieldcn.dev/badge/Vivaldi-8.2.4133.52-ef3939.svg?variant=secondary&amp;logo=vivaldi">
  <img alt="macOS" src="https://shieldcn.dev/badge/macOS-only-171717.svg?variant=secondary&amp;logo=apple">
  <a href="https://bun.sh"><img alt="Bun" src="https://shieldcn.dev/badge/Bun-runtime-fbf0df.svg?variant=secondary&amp;logo=bun&amp;logoColor=171717"></a>
</p>

## What it does

- Closes unpinned left and right auto-hide wrappers when a window loses focus
- Clears stale hotspot state left behind by the window-focus handler
- Preserves explicitly kept-open wrappers and top/bottom visibility
- Keeps the exact original bundle for restoration and refuses to overwrite later edits

## Requirements

- macOS with Vivaldi **8.2.4133.52** installed at `/Applications/Vivaldi.app`
- [Bun](https://bun.sh) to run the script and tests; no dependencies to install

## Usage

Run commands from this project folder. Check that the installed bundle matches before applying:

```bash
bun patch.js check
```

Quit Vivaldi normally, then apply the patch:

```bash
bun patch.js apply
```

To undo, quit Vivaldi again and restore the original:

```bash
bun patch.js restore
```

The backup lives beside `bundle.js` as `bundle.js.autohide-original`. Restore the original before updating Vivaldi; browser updates may replace the patch.

## How it works

The installed window-focus reducer leaves hover visibility and hotspot state intact when a window becomes inactive. The script replaces exactly one matching handler in Vivaldi's `bundle.js` so focus loss clears that state. Missing, duplicate, or already patched targets are rejected.

## Development

```bash
bun test             # state transitions and patch matching
bun patch.js check   # verify the installed bundle matches
```

| File | Purpose |
| --- | --- |
| `patch.js` | Bundle matching, patching, backup, and restoration |
| `patch.test.js` | State preservation and invalid-target tests |

## Limits

This is an experimental local patch, not an official Vivaldi fix. It does not address every possible cause of sticking while the same window remains active.

Modifying the signed application bundle can invalidate its code signature; macOS may reject the modified app. The script does not disable signing or security protections.

### Manual verification

1. Reopen Vivaldi and open two windows.
2. Hover the right sidebar, then activate the other window. The first sidebar should close.
3. Check hover reopening, tab switching, address entry, and explicitly kept-open sidebars.

Automated tests cover state transitions and patch matching, not the running browser or macOS signature acceptance.
