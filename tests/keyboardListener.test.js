import { describe, it, expect, beforeEach } from 'vitest'
import createKeyboardListener from '../public/assets/scripts/keyboardListener.js'

describe('createKeyboardListener', () => {
  let keyboardListener

  beforeEach(() => {
    keyboardListener = createKeyboardListener()
  })

  it('should create a keyboard listener with expected methods', () => {
    expect(keyboardListener).toBeDefined()
    expect(keyboardListener.subscribe).toBeInstanceOf(Function)
    expect(keyboardListener.notifyAll).toBeInstanceOf(Function)
    expect(keyboardListener.registerPlayerId).toBeInstanceOf(Function)
    expect(keyboardListener.handleKeydown).toBeInstanceOf(Function)
  })

  it('should register a player ID', () => {
    keyboardListener.registerPlayerId('player1')
    expect(keyboardListener.handleKeydown({ key: 'ArrowRight' }))
  })

  describe('handleKeydown', () => {
    it('should notify subscribers with move-player command', () => {
      keyboardListener.registerPlayerId('p1')
      const notifications = []
      keyboardListener.subscribe((command) => notifications.push(command))
      keyboardListener.handleKeydown({ key: 'ArrowUp' })
      expect(notifications).toHaveLength(1)
      expect(notifications[0]).toEqual({
        type: 'move-player',
        playerId: 'p1',
        keyPressed: 'ArrowUp',
      })
    })

    it('should notify all subscribers on handleKeydown', () => {
      keyboardListener.registerPlayerId('p1')
      const notifications1 = []
      const notifications2 = []
      keyboardListener.subscribe((cmd) => notifications1.push(cmd))
      keyboardListener.subscribe((cmd) => notifications2.push(cmd))
      keyboardListener.handleKeydown({ key: 'ArrowDown' })
      expect(notifications1).toHaveLength(1)
      expect(notifications2).toHaveLength(1)
    })

    it('should pass any key value through', () => {
      keyboardListener.registerPlayerId('p1')
      const notifications = []
      keyboardListener.subscribe((cmd) => notifications.push(cmd))
      keyboardListener.handleKeydown({ key: 'a' })
      expect(notifications[0].keyPressed).toBe('a')
    })

    it('should include playerId as null when not registered', () => {
      const notifications = []
      keyboardListener.subscribe((cmd) => notifications.push(cmd))
      keyboardListener.handleKeydown({ key: 'ArrowUp' })
      expect(notifications[0].playerId).toBeNull()
    })
  })

  describe('notifyAll', () => {
    it('should notify subscribers with arbitrary commands', () => {
      const notifications = []
      keyboardListener.subscribe((cmd) => notifications.push(cmd))
      keyboardListener.notifyAll({ type: 'test', data: 42 })
      expect(notifications).toHaveLength(1)
      expect(notifications[0]).toEqual({ type: 'test', data: 42 })
    })
  })

  describe('independence', () => {
    it('should have independent state per instance', () => {
      const kl2 = createKeyboardListener()
      const n1 = []
      const n2 = []
      keyboardListener.subscribe((c) => n1.push(c))
      kl2.subscribe((c) => n2.push(c))
      keyboardListener.notifyAll({ type: 'only-first' })
      expect(n1).toHaveLength(1)
      expect(n2).toHaveLength(0)
    })
  })
})
