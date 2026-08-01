import { describe, it, expect } from 'vitest'
import { TILE_SIZE, tileToPixelRect } from '../public/assets/scripts/render.js'

describe('tileToPixelRect', () => {
  it('maps tile origin to pixel origin', () => {
    expect(tileToPixelRect({ x: 0, y: 0 })).toEqual({
      x: 0,
      y: 0,
      width: TILE_SIZE,
      height: TILE_SIZE,
    })
  })

  it('maps tile (1, 1) to the start of the second tile', () => {
    expect(tileToPixelRect({ x: 1, y: 1 })).toEqual({
      x: TILE_SIZE,
      y: TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE,
    })
  })

  it('scales tile coordinates by TILE_SIZE', () => {
    const tile = { x: 12, y: 9 }
    const rect = tileToPixelRect(tile)
    expect(rect.x).toBe(tile.x * TILE_SIZE)
    expect(rect.y).toBe(tile.y * TILE_SIZE)
  })

  it('always produces a TILE_SIZE x TILE_SIZE rect', () => {
    const rect = tileToPixelRect({ x: 24, y: 24 })
    expect(rect.width).toBe(TILE_SIZE)
    expect(rect.height).toBe(TILE_SIZE)
  })
})
