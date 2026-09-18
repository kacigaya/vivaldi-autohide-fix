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

- Closes unpinned left and right auto-hide wrappers when a window loses focus
- Clears stale hotspot state from the window-focus handler
- Preserves kept-open wrappers and top and bottom visibility
- Saves the original bundle and refuses to overwrite later edits

## Requirements

- macOS with Vivaldi **8.2.4133.52** installed at `/Applications/Vivaldi.app`
- [Bun](https://bun.sh) to run the script and tests. No dependencies required.

## Usage

Run commands from this project folder. Check the installed bundle before applying:

```bash
bun patch.js check
```

Quit Vivaldi, then apply the patch:

```bash
bun patch.js apply
```

To undo, quit Vivaldi again and restore the original:

```bash
bun patch.js restore
```

## Built-in timing controls

Vivaldi includes timing controls that reduce normal sidebar hiding time without a patch:

1. Open Settings and search for `biscuit`.
2. Under **Auto-Hide**, set **Close delay** to `100 ms` (default `800 ms`).
3. Set **Closing animation speed** to `100 ms` (default `300 ms`).

These settings reduce normal hiding time from roughly `1.1 seconds` to `0.2 seconds`. This project does not change them. Set them manually.

The backup lives beside `bundle.js` as `bundle.js.autohide-original`. Restore it before updating Vivaldi. Browser updates may replace the patch.

## How it works

The window-focus reducer leaves hover visibility and hotspot state intact when a window becomes inactive. The script replaces one matching handler in Vivaldi's `bundle.js`, so focus loss clears that state. It rejects missing, duplicate, and already patched targets.

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

This is an experimental local patch, not an official Vivaldi fix. It does not address every cause of sticking while the same window remains active.

Modifying the signed application bundle can invalidate its code signature; macOS may reject the modified app. The script does not disable signing or security protections.

### Manual verification

1. Reopen Vivaldi and open two windows.
2. Hover the right sidebar, then activate the other window. The first sidebar should close.
3. Check hover reopening, tab switching, address entry, and explicitly kept-open sidebars.

Automated tests cover state transitions and patch matching. They do not test the running browser or macOS signature acceptance.
