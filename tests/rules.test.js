import { describe, it, expect, beforeEach } from 'vitest'
import createGame from '../public/assets/scripts/rules.js'

describe('createGame', () => {
  let game

  beforeEach(() => {
    game = createGame()
    game.setState({
      screen: { width: 25, height: 25 },
    })
  })

  describe('initial state', () => {
    it('should have default values on creation', () => {
      const fresh = createGame()
      expect(fresh.state.pontos).toBe(0)
      expect(fresh.state.mode).toBe('online')
      expect(fresh.state.screen).toEqual({})
      expect(fresh.state.players).toEqual({})
      expect(fresh.state.walls).toEqual({})
      expect(fresh.state.boxes).toEqual({})
      expect(fresh.state.keys).toEqual({})
      expect(fresh.state.keydoor).toEqual({})
      expect(fresh.state.inventory).toEqual({})
      expect(fresh.state.coins).toEqual({})
      expect(fresh.state.tp).toEqual({})
      expect(fresh.state.spikes).toEqual({})
      expect(fresh.state.pits).toEqual({})
      expect(fresh.state.ice).toEqual({})
      expect(fresh.state.snares).toEqual({})
      expect(fresh.state.darts).toEqual({})
      expect(fresh.state.bombs).toEqual({})
    })

    it('should have a default door, plate and destiny', () => {
      const fresh = createGame()
      expect(fresh.state.door).toEqual({ door1: { x: 12, y: 9 } })
      expect(fresh.state.plate).toEqual({ plate1: { x: 12, y: 1, door: 'door1' } })
      expect(fresh.state.destiny).toEqual({ '1': { x: 24, y: 24 } })
    })
  })

  describe('setState', () => {
    it('should merge new state into existing state', () => {
      game.setState({ pontos: 50 })
      expect(game.state.pontos).toBe(50)
      expect(game.state.screen).toEqual({ width: 25, height: 25 })
    })

    it('should replace top-level keys with new values', () => {
      game.setState({ screen: { width: 10, height: 10 } })
      expect(game.state.screen).toEqual({ width: 10, height: 10 })
    })
  })

  describe('addPlayer', () => {
    it('should add a player at specified coordinates', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 10 })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 10, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should add a player at random coordinates when not specified', () => {
      game.addPlayer({ playerId: 'p1' })
      const player = game.state.players['p1']
      expect(player).toBeDefined()
      expect(player.x).toBeGreaterThanOrEqual(0)
      expect(player.x).toBeLessThan(game.state.screen.width)
      expect(player.y).toBeGreaterThanOrEqual(0)
      expect(player.y).toBeLessThan(game.state.screen.height)
    })

    it('should add a player at x=0 when explicitly given', () => {
      game.addPlayer({ playerId: 'p1', playerX: 0, playerY: 0 })
      expect(game.state.players['p1']).toEqual({ x: 0, y: 0, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should allow multiple players', () => {
      game.addPlayer({ playerId: 'p1', playerX: 1, playerY: 1 })
      game.addPlayer({ playerId: 'p2', playerX: 2, playerY: 2 })
      expect(Object.keys(game.state.players)).toHaveLength(2)
    })

    it('should notify observers on addPlayer', () => {
      const notifications = []
      game.subscribe((command) => notifications.push(command))
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 10 })
      expect(notifications).toHaveLength(1)
      expect(notifications[0]).toMatchObject({
        type: 'add-player',
        playerId: 'p1',
        playerX: 5,
        playerY: 10,
      })
    })
  })

  describe('removePlayer', () => {
    it('should remove an existing player', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 10 })
      game.removePlayer({ playerId: 'p1' })
      expect(game.state.players['p1']).toBeUndefined()
    })

    it('should not throw when removing a non-existent player', () => {
      expect(() => game.removePlayer({ playerId: 'ghost' })).not.toThrow()
    })

    it('should notify observers on removePlayer', () => {
      const notifications = []
      game.subscribe((command) => notifications.push(command))
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 10 })
      game.removePlayer({ playerId: 'p1' })
      expect(notifications).toHaveLength(2)
      expect(notifications[1]).toMatchObject({
        type: 'remove-player',
        playerId: 'p1',
      })
    })

    it('should only remove the specified player', () => {
      game.addPlayer({ playerId: 'p1', playerX: 1, playerY: 1 })
      game.addPlayer({ playerId: 'p2', playerX: 2, playerY: 2 })
      game.removePlayer({ playerId: 'p1' })
      expect(game.state.players['p1']).toBeUndefined()
      expect(game.state.players['p2']).toBeDefined()
    })
  })

  describe('movement', () => {
    it('should move player right with ArrowRight', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should move player left with ArrowLeft', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 4, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should move player up with ArrowUp', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowUp' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 4, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should move player down with ArrowDown', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 6, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should move in sequence', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 7, y: 6, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not affect other players when moving', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.addPlayer({ playerId: 'p2', playerX: 10, playerY: 10 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p2']).toEqual({ x: 10, y: 10, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('bounds', () => {
    it('should not move player out of bounds (left)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 0, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 0, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not move player out of bounds (up)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 0 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowUp' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 0, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not move player out of bounds (right)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 24, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 24, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not move player out of bounds (down)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 24 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 24, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should enforce all bounds simultaneously', () => {
      game.addPlayer({ playerId: 'p1', playerX: 0, playerY: 0 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowUp' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 0, y: 0, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('walls', () => {
    it('should block movement when a wall is in the way', () => {
      game.setState({ walls: { wall1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should allow movement when no wall is in the way', () => {
      game.setState({ walls: { wall1: { x: 7, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should block with multiple walls but only at the right position', () => {
      game.setState({
        walls: {
          wall1: { x: 6, y: 5 },
          wall2: { x: 10, y: 10 },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should allow diagonal-adjacent walls in other axes', () => {
      game.setState({ walls: { wall1: { x: 5, y: 6 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('boxes', () => {
    it('should allow movement when no box is in the way', () => {
      game.setState({ boxes: { box1: { x: 7, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should push a box when the tile beyond is free', () => {
      game.setState({ boxes: { box1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.boxes['box1']).toEqual({ x: 7, y: 5 })
    })

    it('should push a box multiple times in sequence', () => {
      game.setState({ boxes: { box1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 8, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.boxes['box1']).toEqual({ x: 9, y: 5 })
    })

    it('should push a box vertically', () => {
      game.setState({ boxes: { box1: { x: 5, y: 6 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 6, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.boxes['box1']).toEqual({ x: 5, y: 7 })
    })

    it('should block movement when a box cannot be pushed (wall behind)', () => {
      game.setState({
        walls: { wall1: { x: 7, y: 5 } },
        boxes: { box1: { x: 6, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.boxes['box1']).toEqual({ x: 6, y: 5 })
    })

    it('should block movement when another box is behind', () => {
      game.setState({
        boxes: {
          box1: { x: 6, y: 5 },
          box2: { x: 7, y: 5 },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should block movement when a box cannot be pushed (door behind)', () => {
      game.setState({
        door: { door1: { x: 7, y: 5 } },
        boxes: { box1: { x: 6, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not push a box out of bounds', () => {
      game.setState({ boxes: { box1: { x: 0, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 1, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 1, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.boxes['box1']).toEqual({ x: 0, y: 5 })
    })

    it('should fill a pit when a box is pushed into it', () => {
      game.setState({
        pits: { p1: { x: 7, y: 5 } },
        boxes: { box1: { x: 6, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.pits).toEqual({})
      expect(game.state.boxes).toEqual({})
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should allow walking over a filled pit', () => {
      game.setState({
        pits: { p1: { x: 7, y: 5 } },
        boxes: { box1: { x: 6, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 7, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should slide a pushed box across ice with momentum', () => {
      game.setState({
        ice: { i1: { x: 7, y: 5 } },
        boxes: { box1: { x: 6, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.boxes['box1']).toEqual({ x: 7, y: 5 })
      game.tick()
      expect(game.state.boxes['box1']).toEqual({ x: 8, y: 5 })
      game.tick()
      expect(game.state.boxes['box1']).toEqual({ x: 9, y: 5 })
      game.tick()
      expect(game.state.boxes['box1']).toEqual({ x: 9, y: 5 })
    })

    it('should fill a pit when a sliding box runs into it', () => {
      game.setState({
        ice: { i1: { x: 6, y: 5 } },
        pits: { p1: { x: 8, y: 5 } },
        boxes: { box1: { x: 5, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.boxes['box1']).toEqual({ x: 6, y: 5 })
      game.tick()
      game.tick()
      expect(game.state.boxes).toEqual({})
      expect(game.state.pits).toEqual({})
    })
  })

  describe('keys and keydoors', () => {
    it('should collect a key when stepping on it', () => {
      game.setState({ keys: { key1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.inventory['p1']).toBe(1)
      expect(game.state.keys['key1']).toEqual({ x: -1, y: -1 })
    })

    it('should accumulate multiple keys', () => {
      game.setState({
        keys: {
          key1: { x: 6, y: 5 },
          key2: { x: 6, y: 6 },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.inventory['p1']).toBe(2)
    })

    it('should keep keys per player', () => {
      game.setState({ keys: { key1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.addPlayer({ playerId: 'p2', playerX: 20, playerY: 20 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.inventory['p1']).toBe(1)
      expect(game.state.inventory['p2']).toBeUndefined()
    })

    it('should block movement through a keydoor without a key', () => {
      game.setState({ keydoor: { kd1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.keydoor['kd1']).toEqual({ x: 6, y: 5 })
    })

    it('should open a keydoor and consume a key when the player has one', () => {
      game.setState({
        keydoor: { kd1: { x: 6, y: 5 } },
        keys: { key1: { x: 3, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.inventory['p1']).toBe(1)

      game.setState({ players: { p1: { x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 } } })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      expect(game.state.keydoor['kd1']).toBeUndefined()
      expect(game.state.inventory['p1']).toBe(0)
    })

    it('should not use a key when a keydoor is not reached', () => {
      game.setState({
        keydoor: { kd1: { x: 6, y: 5 } },
        keys: { key1: { x: 3, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.inventory['p1']).toBe(1)
      expect(game.state.keydoor['kd1']).toEqual({ x: 6, y: 5 })
    })
  })

  describe('coins', () => {
    it('should collect a coin and increment pontos', () => {
      game.setState({ coins: { coin1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.pontos).toBe(1)
      expect(game.state.coins['coin1']).toEqual({ x: -1, y: -1 })
    })

    it('should increment pontos for each coin collected', () => {
      game.setState({
        coins: {
          coin1: { x: 6, y: 5 },
          coin2: { x: 6, y: 6 },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.pontos).toBe(2)
    })

    it('should not affect other coins when collecting one', () => {
      game.setState({
        coins: {
          coin1: { x: 6, y: 5 },
          coin2: { x: 20, y: 20 },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.coins['coin2']).toEqual({ x: 20, y: 20 })
    })

    it('should not block movement when collecting a coin', () => {
      game.setState({ coins: { coin1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('teleporter', () => {
    it('should teleport player when stepping on a teleporter', () => {
      game.setState({ tp: { tp1: { x: 6, y: 5, destino: { x: 20, y: 20 } } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 20, y: 20, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not activate unrelated teleporters', () => {
      game.setState({
        tp: {
          tp1: { x: 6, y: 5, destino: { x: 20, y: 20 } },
          tp2: { x: 99, y: 99, destino: { x: 1, y: 1 } },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 20, y: 20, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should stop movement at the destination (does not continue)', () => {
      game.setState({ tp: { tp1: { x: 6, y: 5, destino: { x: 20, y: 20 } } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 20, y: 20, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('door and plate', () => {
    it('should block movement when a door is in the way', () => {
      game.setState({ door: { door1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should open a specific door when stepping on the corresponding plate', () => {
      game.setState({
        door: { door1: { x: 6, y: 5 } },
        plate: { plate1: { x: 3, y: 3, door: 'door1' } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.door['door1']).toBeUndefined()
    })

    it('should allow passing through a door after its plate is activated', () => {
      game.setState({
        door: { door1: { x: 6, y: 5 } },
        plate: { plate1: { x: 3, y: 3, door: 'door1' } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.setState({ players: { p1: { x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 } } })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should not affect other doors when a plate is activated', () => {
      game.setState({
        door: {
          door1: { x: 6, y: 5 },
          door2: { x: 10, y: 10 },
        },
        plate: { plate1: { x: 3, y: 3, door: 'door1' } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.door['door2']).toEqual({ x: 10, y: 10 })
    })

    it('only removes the pressed plate and its door, keeping others', () => {
      game.setState({
        door: {
          door1: { x: 6, y: 5 },
          door2: { x: 10, y: 10 },
        },
        plate: {
          plate1: { x: 3, y: 3, door: 'door1' },
          plate2: { x: 5, y: 5, door: 'door2' },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.door['door1']).toBeUndefined()
      expect(game.state.door['door2']).toEqual({ x: 10, y: 10 })
      expect(game.state.plate['plate1']).toBeUndefined()
      expect(game.state.plate['plate2']).toEqual({ x: 5, y: 5, door: 'door2' })
    })

    it('opens a door referenced by object when its plate is pressed', () => {
      const doorObj = { x: 6, y: 5 }
      game.setState({
        door: {
          door1: doorObj,
          door2: { x: 10, y: 10 },
        },
        plate: { plate1: { x: 3, y: 3, door: doorObj } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.door['door1']).toBeUndefined()
      expect(game.state.door['door2']).toEqual({ x: 10, y: 10 })
    })

    it('does not crash when pressing a plate without a linked door', () => {
      game.setState({ plate: { plate1: { x: 3, y: 3 } } })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      expect(() => {
        game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      }).not.toThrow()
      expect(game.state.plate['plate1']).toBeUndefined()
    })
  })

  describe('subscribe and notify', () => {
    it('should notify observers on movePlayer with the command', () => {
      const notifications = []
      game.subscribe((command) => notifications.push(command))
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(notifications).toHaveLength(2)
      expect(notifications[1]).toEqual({
        playerId: 'p1',
        keyPressed: 'ArrowRight',
      })
    })

    it('should support multiple observers', () => {
      const n1 = []
      const n2 = []
      game.subscribe((c) => n1.push(c))
      game.subscribe((c) => n2.push(c))
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      expect(n1).toHaveLength(1)
      expect(n2).toHaveLength(1)
    })

    it('should notify observers when tick runs', () => {
      const notifications = []
      game.subscribe((command) => notifications.push(command))
      game.tick()
      expect(notifications).toContainEqual({ type: 'tick' })
    })

    it('observer arrays should be independent per game instance', () => {
      const game2 = createGame()
      const n1 = []
      const n2 = []
      game.subscribe((c) => n1.push(c))
      game2.subscribe((c) => n2.push(c))
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      expect(n1).toHaveLength(1)
      expect(n2).toHaveLength(0)
    })
  })

  describe('edge cases', () => {
    it('should handle unknown keys gracefully', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      expect(() => {
        game.movePlayer({ playerId: 'p1', keyPressed: 'UnknownKey' })
      }).not.toThrow()
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('should crash when moving a non-existent player (player is undefined)', () => {
      expect(() => {
        game.movePlayer({ playerId: 'nobody', keyPressed: 'ArrowRight' })
      }).toThrow()
    })

    it('destiny tile does not block movement', () => {
      game.addPlayer({ playerId: 'p1', playerX: 23, playerY: 24 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 24, y: 24, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('reaching the destiny tile triggers a win', () => {
      game.addPlayer({ playerId: 'p1', playerX: 23, playerY: 24 })
      expect(game.state.win).toBe(false)
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.win).toBe(true)
    })

    it('should return the state reference from the public API', () => {
      expect(game.state).toBeDefined()
      game.state.pontos = 99
      expect(game.state.pontos).toBe(99)
    })
  })

  describe('lives', () => {
    it('new players start with 3 lives', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      expect(game.state.players['p1'].lives).toBe(3)
    })

    it('stepping on spikes costs a life', () => {
      game.setState({ spikes: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1'].lives).toBe(2)
    })

    it('invulnerability prevents immediate repeated damage', () => {
      game.setState({ spikes: { s1: { x: 6, y: 5 }, s2: { x: 7, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1'].lives).toBe(2)
    })

    it('death respawns at spawn with full lives', () => {
      game.setState({ spawn: { x: 12, y: 0 }, spikes: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.state.players['p1'].lives = 1
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 12, y: 0, lives: 3, stun: 0, invulnerable: 2 })
    })

    it('triggers game over in single mode when lives run out', () => {
      game.setState({ mode: 'single', spawn: { x: 12, y: 0 }, spikes: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.state.players['p1'].lives = 1
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.gameOver).toBe(true)
      expect(game.state.players['p1'].lives).toBe(0)
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 0, stun: 0, invulnerable: 2 })
    })

    it('blocks further movement after game over', () => {
      game.setState({ mode: 'single', spikes: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.state.players['p1'].lives = 1
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.gameOver).toBe(true)
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 0, stun: 0, invulnerable: 2 })
    })
  })

  describe('pit', () => {
    it('sends the player back to spawn', () => {
      game.setState({ spawn: { x: 12, y: 0 }, pits: { p1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 12, y: 0, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('ice', () => {
    it('slides one tile per tick and carries one extra tile of momentum', () => {
      game.setState({ ice: { i1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 7, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 8, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 8, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('stops sliding at a wall', () => {
      game.setState({ ice: { i1: { x: 6, y: 5 } }, walls: { w1: { x: 7, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('slides one tile per tick through a chain and carries momentum after it', () => {
      game.setState({ ice: { i1: { x: 6, y: 5 }, i2: { x: 7, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 7, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 8, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 9, y: 5, lives: 3, stun: 0, invulnerable: 0 })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 9, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('stops sliding once the momentum runs out', () => {
      game.setState({ ice: { i1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      game.tick()
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 8, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })
  })

  describe('snare', () => {
    it('stuns a player that steps on it and consumes the snare', () => {
      game.setState({ snares: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1'].stun).toBe(3)
      expect(game.state.snares['s1']).toBeUndefined()
    })

    it('cannot move while stunned', () => {
      game.setState({ snares: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5, lives: 3, stun: 2, invulnerable: 0 })
    })

    it('recovers after the stun expires', () => {
      game.setState({ snares: { s1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 7, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('a snare stops an ongoing ice slide', () => {
      game.setState({
        ice: { i1: { x: 6, y: 5 } },
        snares: { s1: { x: 7, y: 5 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      expect(game.state.players['p1']).toEqual({ x: 7, y: 5, lives: 3, stun: 3, invulnerable: 0 })
      expect(game.state.snares['s1']).toBeUndefined()
    })
  })

  describe('dart', () => {
    it('is passable and does not damage on contact with the emitter', () => {
      game.setState({ darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3 } } })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('fires a projectile that travels and damages a player in its path', () => {
      game.setState({ darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3, speed: 1 } } })
      game.state.darts['d1'].cooldown = 0
      game.addPlayer({ playerId: 'p1', playerX: 8, playerY: 5 })
      game.tick()
      game.tick()
      game.tick()
      expect(game.state.players['p1'].lives).toBe(2)
      expect(game.state.projectiles).toEqual({})
    })

    it('does not damage players in other tiles', () => {
      game.setState({ darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3, speed: 1 } } })
      game.state.darts['d1'].cooldown = 0
      game.addPlayer({ playerId: 'p1', playerX: 8, playerY: 6 })
      game.tick()
      game.tick()
      game.tick()
      game.tick()
      expect(game.state.players['p1'].lives).toBe(3)
    })

    it('removes a projectile that hits a wall', () => {
      game.setState({
        darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3, speed: 1 } },
        walls: { w1: { x: 7, y: 5 } },
      })
      game.state.darts['d1'].cooldown = 0
      game.tick()
      game.tick()
      expect(game.state.projectiles).toEqual({})
    })

    it('respects the dart range', () => {
      game.setState({ darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3, speed: 1 } } })
      game.state.darts['d1'].cooldown = 0
      for(let i = 0; i < 4; i++) game.tick()
      expect(game.state.projectiles).toEqual({})
    })

    it('moves at half speed when speed is 2', () => {
      game.setState({ darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3, speed: 2 } } })
      game.state.darts['d1'].cooldown = 0
      game.tick()
      expect(Object.values(game.state.projectiles)[0]).toMatchObject({ x: 5, y: 5 })
      game.tick()
      expect(Object.values(game.state.projectiles)[0]).toMatchObject({ x: 6, y: 5 })
    })

    it('only fires when the cooldown has elapsed', () => {
      game.setState({ darts: { d1: { x: 5, y: 5, direction: 'ArrowRight', range: 3, cooldown: 4 } } })
      game.tick()
      expect(Object.keys(game.state.projectiles)).toHaveLength(0)
      game.tick()
      game.tick()
      game.tick()
      expect(Object.keys(game.state.projectiles)).toHaveLength(1)
    })
  })

  describe('bomb', () => {
    it('turns into a shockwave when stepped on', () => {
      game.setState({ bombs: { b1: { x: 6, y: 5, radius: 2 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.bombs['b1']).toBeUndefined()
      expect(Object.keys(game.state.shockwaves)).toHaveLength(1)
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5, lives: 3, stun: 0, invulnerable: 0 })
    })

    it('shockwave damages the player as it expands', () => {
      game.setState({ bombs: { b1: { x: 6, y: 5, radius: 2 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      expect(game.state.players['p1'].lives).toBe(2)
    })

    it('damages players within the radius as the wave expands', () => {
      game.setState({ bombs: { b1: { x: 5, y: 5, radius: 2 } } })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.addPlayer({ playerId: 'p2', playerX: 6, playerY: 6 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      expect(game.state.players['p1'].lives).toBe(2)
      expect(game.state.players['p2'].lives).toBe(3)
      game.tick()
      expect(game.state.players['p2'].lives).toBe(2)
      expect(game.state.shockwaves).toEqual({})
    })

    it('only damages a player once per shockwave', () => {
      game.setState({ bombs: { b1: { x: 5, y: 5, radius: 3 } } })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      game.tick()
      game.tick()
      expect(game.state.players['p1'].lives).toBe(2)
    })

    it('explodes when its plate is stepped on', () => {
      game.setState({
        bombs: { b1: { x: 5, y: 8, radius: 1, plate: 'plate1' } },
        plate: { plate1: { x: 4, y: 3 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 3, playerY: 3 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.bombs['b1']).toBeUndefined()
      expect(game.state.plate['plate1']).toBeUndefined()
      expect(Object.keys(game.state.shockwaves)).toHaveLength(1)
    })

    it('defaults to a radius of 3 tiles', () => {
      game.setState({ bombs: { b1: { x: 5, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(Object.values(game.state.shockwaves)[0].maxRadius).toBe(3)
    })

    it('breaks boxes within the shockwave radius as it expands', () => {
      game.setState({
        bombs: { b1: { x: 5, y: 5, radius: 2 } },
        boxes: {
          near: { x: 5, y: 6 },
          edge: { x: 5, y: 7 },
          far: { x: 9, y: 5 },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.tick()
      expect(game.state.boxes['near']).toBeUndefined()
      expect(game.state.boxes['edge']).toBeDefined()
      game.tick()
      expect(game.state.boxes['edge']).toBeUndefined()
      expect(game.state.boxes['far']).toBeDefined()
    })

    it('does not let boxes block the shockwave', () => {
      game.setState({
        bombs: { b1: { x: 5, y: 5, radius: 3 } },
        boxes: { b1: { x: 5, y: 6 } },
        walls: { w1: { x: 5, y: 8 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(Object.values(game.state.shockwaves)[0].maxRadius).toBe(2)
      game.tick()
      expect(game.state.boxes['b1']).toBeUndefined()
    })

    it('stops expanding when it reaches a wall', () => {
      game.setState({
        bombs: { b1: { x: 5, y: 5, radius: 3 } },
        walls: { w1: { x: 5, y: 8 } },
      })
      game.addPlayer({ playerId: 'p1', playerX: 4, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(Object.values(game.state.shockwaves)[0].maxRadius).toBe(2)
      game.tick()
      game.tick()
      expect(game.state.shockwaves).toEqual({})
      expect(game.state.players['p1'].lives).toBe(2)
    })
  })
})
