import { readFileSync, writeFileSync, existsSync, copyFileSync, renameSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const BUNDLE_PATH = '/Applications/Vivaldi.app/Contents/Frameworks/Vivaldi Framework.framework/Versions/8.2.4133.52/Resources/vivaldi/bundle.js';
export const ORIGINAL = 'new Map(e).set(n,{...s,active:i,controlsData:(0,c.Oq)(n,s)})';
// Preserve explicit keep-open state; discard stale hover state on focus loss.
export const REPLACEMENT = 'new Map(e).set(n,{...s,active:i,...(!i?{hotSpotStatus:"away",autoHide:new Map(Array.from(s.autoHide,([position,state])=>[position,(position==="left"||position==="right")&&!state.keepOpen?{...state,visible:!1}:state]))}:{}),controlsData:(0,c.Oq)(n,s)})';

export function patchBundle(source) {
  if (source.split(ORIGINAL).length !== 2) throw new Error('Expected exactly one matching focus handler. Refusing to patch.');
  return source.replace(ORIGINAL, REPLACEMENT);
}

function main() {
  const command = process.argv[2];
  if (!['check', 'apply', 'restore'].includes(command)) {
    throw new Error('Usage: bun patch.js check|apply|restore (Vivaldi 8.2.4133.52 only). Quit Vivaldi before apply/restore.');
  }
  const backupPath = `${BUNDLE_PATH}.autohide-original`;
  const source = readFileSync(BUNDLE_PATH, 'utf8');
  if (command === 'check') {
    patchBundle(source);
    console.log('Installed bundle matches. Candidate patch can be applied.');
    return;
  }
  let result;
  if (command === 'restore') {
    const original = readFileSync(backupPath, 'utf8');
    if (source !== patchBundle(original)) throw new Error('Bundle changed since patching. Refusing to overwrite.');
    result = original;
  } else {
    result = patchBundle(source);
    if (existsSync(backupPath) && readFileSync(backupPath, 'utf8') !== source) throw new Error('Backup differs. Refusing to overwrite it.');
    if (!existsSync(backupPath)) copyFileSync(BUNDLE_PATH, backupPath);
  }
  const temporaryPath = `${BUNDLE_PATH}.autohide-tmp`;
  writeFileSync(temporaryPath, result, { flag: 'wx' });
  renameSync(temporaryPath, BUNDLE_PATH);
  console.log(command === 'restore' ? 'Original bundle restored.' : 'Patch applied. Reopen Vivaldi to test.');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
