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
      expect(fresh.state.screen).toEqual({})
      expect(fresh.state.players).toEqual({})
      expect(fresh.state.walls).toEqual({})
      expect(fresh.state.coins).toEqual({})
      expect(fresh.state.tp).toEqual({})
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
      expect(game.state.players['p1']).toEqual({ x: 5, y: 10 })
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
      expect(game.state.players['p1']).toEqual({ x: 0, y: 0 })
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
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5 })
    })

    it('should move player left with ArrowLeft', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 4, y: 5 })
    })

    it('should move player up with ArrowUp', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowUp' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 4 })
    })

    it('should move player down with ArrowDown', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 6 })
    })

    it('should move in sequence', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 7, y: 6 })
    })

    it('should not affect other players when moving', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.addPlayer({ playerId: 'p2', playerX: 10, playerY: 10 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p2']).toEqual({ x: 10, y: 10 })
    })
  })

  describe('bounds', () => {
    it('should not move player out of bounds (left)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 0, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 0, y: 5 })
    })

    it('should not move player out of bounds (up)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 0 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowUp' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 0 })
    })

    it('should not move player out of bounds (right)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 24, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 24, y: 5 })
    })

    it('should not move player out of bounds (down)', () => {
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 24 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowDown' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 24 })
    })

    it('should enforce all bounds simultaneously', () => {
      game.addPlayer({ playerId: 'p1', playerX: 0, playerY: 0 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowUp' })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowLeft' })
      expect(game.state.players['p1']).toEqual({ x: 0, y: 0 })
    })
  })

  describe('walls', () => {
    it('should block movement when a wall is in the way', () => {
      game.setState({ walls: { wall1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5 })
    })

    it('should allow movement when no wall is in the way', () => {
      game.setState({ walls: { wall1: { x: 7, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5 })
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
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5 })
    })

    it('should allow diagonal-adjacent walls in other axes', () => {
      game.setState({ walls: { wall1: { x: 5, y: 6 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5 })
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
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5 })
    })
  })

  describe('teleporter', () => {
    it('should teleport player when stepping on a teleporter', () => {
      game.setState({ tp: { tp1: { x: 6, y: 5, destino: { x: 20, y: 20 } } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 20, y: 20 })
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
      expect(game.state.players['p1']).toEqual({ x: 20, y: 20 })
    })

    it('should stop movement at the destination (does not continue)', () => {
      game.setState({ tp: { tp1: { x: 6, y: 5, destino: { x: 20, y: 20 } } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 20, y: 20 })
    })
  })

  describe('door and plate', () => {
    it('should block movement when a door is in the way', () => {
      game.setState({ door: { door1: { x: 6, y: 5 } } })
      game.addPlayer({ playerId: 'p1', playerX: 5, playerY: 5 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5 })
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
      game.setState({ players: { p1: { x: 5, y: 5 } } })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 6, y: 5 })
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

    it('BUG: plate deletes entire state.plate instead of one entry, crashing on multi-plate maps', () => {
      game.setState({
        plate: {
          plate1: { x: 3, y: 3, door: 'door1' },
          plate2: { x: 5, y: 5, door: 'door2' },
        },
      })
      game.addPlayer({ playerId: 'p1', playerX: 2, playerY: 3 })
      expect(() => {
        game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      }).toThrow()
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
      expect(game.state.players['p1']).toEqual({ x: 5, y: 5 })
    })

    it('should crash when moving a non-existent player (player is undefined)', () => {
      expect(() => {
        game.movePlayer({ playerId: 'nobody', keyPressed: 'ArrowRight' })
      }).toThrow()
    })

    it('destiny tile does not block movement', () => {
      game.addPlayer({ playerId: 'p1', playerX: 23, playerY: 24 })
      game.movePlayer({ playerId: 'p1', keyPressed: 'ArrowRight' })
      expect(game.state.players['p1']).toEqual({ x: 24, y: 24 })
    })

    it('should return the state reference from the public API', () => {
      expect(game.state).toBeDefined()
      game.state.pontos = 99
      expect(game.state.pontos).toBe(99)
    })
  })
})
