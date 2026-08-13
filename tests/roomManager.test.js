import { describe, it, expect } from 'vitest'
import { generateRoomCode, createRoomManager, worldMaps, getWorldMap, getWorldList } from '../back-end/roomManager.js'

describe('generateRoomCode', () => {
  it('returns a code of 5 uppercase alphanumeric chars', () => {
    expect(generateRoomCode()).toMatch(/^[A-Z0-9]{5}$/)
  })

  it('avoids codes that already exist', () => {
    const existing = new Set(['AAAAA', 'BBBBB'])
    const code = generateRoomCode(existing)
    expect(existing.has(code)).toBe(false)
  })

  it('produces unique codes across many calls', () => {
    const codes = new Set()
    for (let i = 0; i < 1000; i++) {
      codes.add(generateRoomCode())
    }
    expect(codes.size).toBe(1000)
  })
})

describe('createRoomManager', () => {
  it('creates a room with a code and a game instance', () => {
    const manager = createRoomManager()
    const { code, game } = manager.createRoom()
    expect(code).toMatch(/^[A-Z0-9]{5}$/)
    expect(manager.hasRoom(code)).toBe(true)
    expect(game.state.players).toBeDefined()
  })

  it('creates independent game instances per room', () => {
    const manager = createRoomManager()
    const roomA = manager.createRoom()
    const roomB = manager.createRoom()
    expect(roomA.code).not.toBe(roomB.code)
    expect(roomA.game).not.toBe(roomB.game)
    expect(roomA.game.state).not.toBe(roomB.game.state)
  })

  it('gives each room its own world copy', () => {
    const manager = createRoomManager()
    const roomA = manager.createRoom()
    const roomB = manager.createRoom()
    roomA.game.state.coins['coin1'] = { x: 1, y: 1 }
    expect(roomB.game.state.coins['coin1']).toBeUndefined()
  })

  it('looks up rooms by code', () => {
    const manager = createRoomManager()
    const { code, game } = manager.createRoom()
    expect(manager.getRoom(code)).toBe(game)
    expect(manager.getRoom('ZZZZZ')).toBeUndefined()
  })

  it('deletes rooms', () => {
    const manager = createRoomManager()
    const { code } = manager.createRoom()
    expect(manager.deleteRoom(code)).toBe(true)
    expect(manager.hasRoom(code)).toBe(false)
  })

  it('defaults to online mode', () => {
    const manager = createRoomManager()
    const { game } = manager.createRoom()
    expect(game.state.mode).toBe('online')
  })

  it('sets single mode when requested', () => {
    const manager = createRoomManager()
    const { game } = manager.createRoom('single')
    expect(game.state.mode).toBe('single')
  })
})

describe('worldMaps', () => {
  it('exposes six playable maps', () => {
    expect(Object.keys(worldMaps)).toHaveLength(6)
    for (const world of Object.values(worldMaps)) {
      expect(world.name).toBeDefined()
      expect(world.spawn.x).toBeDefined()
      expect(world.spawn.y).toBeDefined()
    }
  })

  it('gets a world by id', () => {
    expect(getWorldMap('world1').state.screen).toEqual({ width: 50, height: 50 })
    expect(getWorldMap('world3').state.screen).toEqual({ width: 25, height: 25 })
  })

  it('falls back to world3 for unknown ids', () => {
    expect(getWorldMap('mapa-inexistente')).toBe(worldMaps.world3)
  })

  it('loads the requested map when creating a room', () => {
    const manager = createRoomManager()
    const { game } = manager.createRoom('online', 'world1')
    expect(game.state.screen).toEqual({ width: 50, height: 50 })
    expect(game.state.spawn).toEqual({ x: 25, y: 43 })
  })

  it('defaults to world3 when no map is specified', () => {
    const manager = createRoomManager()
    const { game } = manager.createRoom()
    expect(game.state.screen).toEqual({ width: 25, height: 25 })
    expect(game.state.spawn).toEqual({ x: 12, y: 0 })
  })

  it('falls back to world3 for unknown maps', () => {
    const manager = createRoomManager()
    const { game } = manager.createRoom('online', 'mapa-inexistente')
    expect(game.state.screen).toEqual({ width: 25, height: 25 })
  })

  it('keeps spawn points independent between rooms', () => {
    const manager = createRoomManager()
    const roomA = manager.createRoom('online', 'world1')
    const roomB = manager.createRoom('online', 'world3')
    roomA.game.state.spawn.x = 999
    expect(roomB.game.state.spawn).toEqual({ x: 12, y: 0 })
  })
})

describe('getWorldList', () => {
  it('returns one entry per world with id and name', () => {
    const worlds = getWorldList()
    expect(worlds).toHaveLength(6)
    for (const world of worlds) {
      expect(typeof world.id).toBe('string')
      expect(typeof world.name).toBe('string')
    }
  })

  it('exposes the state used to render the preview', () => {
    const worlds = getWorldList()
    const world1 = worlds.find(w => w.id === 'world1')
    expect(world1.state.screen).toEqual({ width: 50, height: 50 })
  })
})
