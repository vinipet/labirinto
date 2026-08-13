import { describe, it, expect } from 'vitest'
import { TILE_SIZE, tileToPixelRect, drawTiles } from '../public/assets/scripts/render.js'

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

  it('scales the rect when a scale is provided', () => {
    const rect = tileToPixelRect({ x: 2, y: 3 }, 0.5)
    expect(rect.x).toBe(16)
    expect(rect.y).toBe(24)
    expect(rect.width).toBe(8)
    expect(rect.height).toBe(8)
  })
})

function createMockScreen() {
  const rects = []
  return {
    rects,
    fillStyle: '',
    fillRect(x, y, width, height) {
      rects.push({ fillStyle: this.fillStyle, x, y, width, height })
    },
  }
}

describe('drawTiles', () => {
  it('draws every tile of every layer', () => {
    const screen = createMockScreen()
    drawTiles(screen, {
      walls: { a: { x: 0, y: 0 } },
      boxes: { b: { x: 1, y: 1 } },
      coins: { c: { x: 2, y: 2 } },
    })
    expect(screen.rects).toHaveLength(3)
    expect(screen.rects[0]).toMatchObject({ x: 0, y: 0 })
    expect(screen.rects[1]).toMatchObject({ x: TILE_SIZE, y: TILE_SIZE })
    expect(screen.rects[2]).toMatchObject({ x: TILE_SIZE * 2, y: TILE_SIZE * 2 })
  })

  it('lets the caller override layer colors', () => {
    const screen = createMockScreen()
    drawTiles(screen, { walls: { a: { x: 0, y: 0 } } }, 1, { walls: 'black' })
    expect(screen.rects[0].fillStyle).toBe('black')
  })
})
