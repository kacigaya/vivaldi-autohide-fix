import { test, expect } from 'bun:test';
import { ORIGINAL, REPLACEMENT, patchBundle } from './patch.js';

test('focus loss closes hover sidebars, preserving pinned state and other windows', () => {
  const update = new Function('e', 'n', 's', 'i', 'c', `return ${REPLACEMENT}`);
  const state = { active: true, hotSpotStatus: 'above', autoHide: new Map([
    ['right', { visible: true, keepOpen: false }],
    ['left', { visible: true, keepOpen: true }],
    ['top', { visible: true, keepOpen: false }],
  ]) };
  const other = { active: false };
  const windows = new Map([[1, state], [2, other]]);
  const result = update(windows, 1, state, false, { Oq: () => ({}) });
  expect(result.get(1).autoHide.get('right').visible).toBe(false);
  expect(result.get(1).autoHide.get('left').visible).toBe(true);
  expect(result.get(1).autoHide.get('top').visible).toBe(true);
  expect(result.get(1).hotSpotStatus).toBe('away');
  expect(result.get(2)).toBe(other);
  expect(state.autoHide.get('right').visible).toBe(true);
  expect(update(windows, 1, state, true, { Oq: () => ({}) }).get(1).autoHide).toBe(state.autoHide);
});

test('patch rejects missing, duplicate, or already patched targets', () => {
  expect(patchBundle(ORIGINAL)).toBe(REPLACEMENT);
  for (const source of ['', ORIGINAL + ORIGINAL, REPLACEMENT]) expect(() => patchBundle(source)).toThrow();
});
