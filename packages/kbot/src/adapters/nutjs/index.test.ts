// nut.js adapter tests.
// The pure mapping helpers are exhaustively tested. The nut-backed primitives
// are tested for their not-installed fallback — which is the actual state on
// the CI/dev hosts (macOS/Linux), where @nut-tree-fork/nut-js is absent, so
// these assertions exercise the real degradation path, not a mock.
import { describe, it, expect } from 'vitest'
import {
  resolveKeyName,
  parseKeyCombo,
  resolveButtonName,
  nutAvailable,
  nutScreenshot,
  nutClick,
  nutKey,
  nutType,
} from './index.js'

describe('resolveKeyName', () => {
  it('maps named keys (case-insensitive)', () => {
    expect(resolveKeyName('enter')).toBe('Enter')
    expect(resolveKeyName('ENTER')).toBe('Enter')
    expect(resolveKeyName('esc')).toBe('Escape')
    expect(resolveKeyName('pageup')).toBe('PageUp')
  })

  it('maps modifier aliases to the platform members', () => {
    expect(resolveKeyName('ctrl')).toBe('LeftControl')
    expect(resolveKeyName('control')).toBe('LeftControl')
    expect(resolveKeyName('cmd')).toBe('LeftSuper')
    expect(resolveKeyName('win')).toBe('LeftSuper')
    expect(resolveKeyName('alt')).toBe('LeftAlt')
    expect(resolveKeyName('option')).toBe('LeftAlt')
    expect(resolveKeyName('shift')).toBe('LeftShift')
  })

  it('maps letters, digits, and function keys', () => {
    expect(resolveKeyName('a')).toBe('A')
    expect(resolveKeyName('Z')).toBe('Z')
    expect(resolveKeyName('5')).toBe('Num5')
    expect(resolveKeyName('f1')).toBe('F1')
    expect(resolveKeyName('f12')).toBe('F12')
  })

  it('returns null for unknown / out-of-range tokens', () => {
    expect(resolveKeyName('f13')).toBeNull()
    expect(resolveKeyName('hyper')).toBeNull()
    expect(resolveKeyName('ab')).toBeNull()
    expect(resolveKeyName('')).toBeNull()
  })
})

describe('parseKeyCombo', () => {
  it('parses single keys', () => {
    expect(parseKeyCombo('enter')).toEqual(['Enter'])
    expect(parseKeyCombo('a')).toEqual(['A'])
  })

  it('parses combos with modifiers first, main key last', () => {
    expect(parseKeyCombo('ctrl+c')).toEqual(['LeftControl', 'C'])
    expect(parseKeyCombo('ctrl+shift+s')).toEqual(['LeftControl', 'LeftShift', 'S'])
    expect(parseKeyCombo('cmd+space')).toEqual(['LeftSuper', 'Space'])
  })

  it('tolerates whitespace and empty segments', () => {
    expect(parseKeyCombo(' ctrl + c ')).toEqual(['LeftControl', 'C'])
  })

  it('returns null if any segment is unrecognized', () => {
    expect(parseKeyCombo('ctrl+nope')).toBeNull()
    expect(parseKeyCombo('')).toBeNull()
    expect(parseKeyCombo('+')).toBeNull()
  })
})

describe('resolveButtonName', () => {
  it('maps button names, defaulting to LEFT', () => {
    expect(resolveButtonName('left')).toBe('LEFT')
    expect(resolveButtonName('right')).toBe('RIGHT')
    expect(resolveButtonName('middle')).toBe('MIDDLE')
    expect(resolveButtonName('double')).toBe('LEFT') // double handled separately
    expect(resolveButtonName('garbage')).toBe('LEFT')
  })
})

describe('not-installed fallback (no nut.js on this host)', () => {
  it('reports unavailable', async () => {
    expect(await nutAvailable()).toBe(false)
  })

  it('primitives return a helpful install hint instead of throwing', async () => {
    for (const r of [
      await nutScreenshot(),
      await nutClick(10, 10, 'left'),
      await nutType('hi'),
      await nutKey('ctrl+c'),
    ]) {
      expect(r.ok).toBe(false)
      if (!r.ok) expect(r.error).toMatch(/nut\.js not available/i)
    }
  })
})
