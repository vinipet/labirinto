import { describe, it, expect } from 'vitest'
import { generateRoomCode, createRoomManager } from '../back-end/roomManager.js'

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
})
