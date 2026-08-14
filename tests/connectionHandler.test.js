import { describe, it, expect, beforeEach } from 'vitest'
import handleConnection from '../back-end/connectionHandler.js'
import { createRoomManager } from '../back-end/roomManager.js'

function createFakeSocket(id) {
   const handlers = {}
   const socket = {
      id,
      gameRoom: null,
      rooms: new Set(),
      emitted: [],
      emit(event, payload) {
         socket.emitted.push({ event, payload })
      },
      on(event, handler) {
         handlers[event] = handler
      },
      join(room) {
         socket.rooms.add(room)
      },
      leave(room) {
         socket.rooms.delete(room)
      },
      fire(event, payload) {
         handlers[event](payload)
      },
   }
   return socket
}

describe('handleConnection', () => {
   let roomManager
   let broadcasts
   let socketA
   let socketB

   beforeEach(() => {
      roomManager = createRoomManager()
      broadcasts = []
      socketA = createFakeSocket('playerA')
      socketB = createFakeSocket('playerB')
      handleConnection(socketA, {
         roomManager,
         broadcast: (code, type, command) => broadcasts.push({ code, type, command }),
      })
      handleConnection(socketB, {
         roomManager,
         broadcast: (code, type, command) => broadcasts.push({ code, type, command }),
      })
   })

   function findSetup(socket) {
      return socket.emitted.find((e) => e.event === 'setup')
   }

   function readyUp(socket, ready = true) {
      socket.fire('ready-up', { ready })
   }

   it('creates a room and sends setup with a unique code', () => {
      socketA.fire('create-room')

      const setup = findSetup(socketA)
      expect(setup).toBeDefined()
      expect(setup.payload.code).toMatch(/^[A-Z0-9]{5}$/)
      expect(roomManager.hasRoom(setup.payload.code)).toBe(true)
      expect(socketA.rooms.has(setup.payload.code)).toBe(true)
      expect(socketA.gameRoom).toBe(setup.payload.code)
      expect(setup.payload.state.players['playerA']).toEqual({ x: 12, y: 0, lives: 3, stun: 0, invulnerable: 0, pontos: 0 })
   })

   it('creates a new game instance for each room', () => {
      socketA.fire('create-room')
      socketB.fire('create-room')

      const codeA = findSetup(socketA).payload.code
      const codeB = findSetup(socketB).payload.code
      expect(codeA).not.toBe(codeB)
      expect(roomManager.getRoom(codeA)).not.toBe(roomManager.getRoom(codeB))
   })

   it('joins an existing room by code', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code

      socketB.fire('join-room', { code })

      const setupB = findSetup(socketB)
      expect(setupB.payload.code).toBe(code)
      expect(roomManager.getRoom(code).state.players['playerB']).toEqual({ x: 12, y: 0, lives: 3, stun: 0, invulnerable: 0, pontos: 0 })
      expect(socketB.rooms.has(code)).toBe(true)
      expect(broadcasts).toContainEqual(
         expect.objectContaining({
            code,
            type: 'add-player',
            command: expect.objectContaining({ type: 'add-player', playerId: 'playerB' }),
         })
      )
   })

   it('is case insensitive when joining rooms', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code

      socketB.fire('join-room', { code: code.toLowerCase() })

      expect(findSetup(socketB).payload.code).toBe(code)
   })

   it('creates a single mode room when requested', () => {
      socketA.fire('create-room', { mode: 'single' })

      const setup = findSetup(socketA)
      expect(setup.payload.state.mode).toBe('single')
   })

   it('creates an online mode room by default', () => {
      socketA.fire('create-room')

      const setup = findSetup(socketA)
      expect(setup.payload.state.mode).toBe('online')
   })

   it('blocks joining a single player room', () => {
      socketA.fire('create-room', { mode: 'single' })
      const code = findSetup(socketA).payload.code

      socketB.fire('join-room', { code })

      const notFound = socketB.emitted.find((e) => e.event === 'room-not-found')
      expect(notFound).toBeDefined()
      expect(socketB.rooms.has(code)).toBe(false)
   })

   it('reports room-not-found for an invalid code', () => {
      socketA.fire('join-room', { code: 'ZZZZZ' })

      const notFound = socketA.emitted.find((e) => e.event === 'room-not-found')
      expect(notFound).toBeDefined()
      expect(notFound.payload).toEqual({ code: 'ZZZZZ' })
      expect(socketA.gameRoom).toBeNull()
   })

   it('stores the chosen map and its spawn point', () => {
      socketA.fire('create-room', { mode: 'online', map: 'world1' })

      const setup = findSetup(socketA)
      expect(setup.payload.state.screen).toEqual({ width: 50, height: 50 })
      expect(setup.payload.state.players['playerA']).toMatchObject({ x: 25, y: 43 })
   })

   it('stores the player name on create', () => {
      socketA.fire('create-room', { mode: 'online', name: 'Maria' })

      const setup = findSetup(socketA)
      expect(setup.payload.state.players['playerA'].name).toBe('Maria')
   })

   it('stores the player name on join', () => {
      socketA.fire('create-room', { mode: 'online', name: 'Maria' })
      const code = findSetup(socketA).payload.code

      socketB.fire('join-room', { code, name: 'Joao' })

      expect(roomManager.getRoom(code).state.players['playerB'].name).toBe('Joao')
   })

   it('trims the player name', () => {
      socketA.fire('create-room', { mode: 'online', name: '  Ana  ' })

      const setup = findSetup(socketA)
      expect(setup.payload.state.players['playerA'].name).toBe('Ana')
   })

   it('defaults to no name when not provided', () => {
      socketA.fire('create-room', { mode: 'online' })

      const setup = findSetup(socketA)
      expect(setup.payload.state.players['playerA'].name).toBeUndefined()
   })

   it('routes move-player to the correct room game', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code
      readyUp(socketA)
      socketA.fire('start-game')

      socketA.fire('move-player', { keyPressed: 'ArrowRight' })

      expect(roomManager.getRoom(code).state.players['playerA']).toEqual({ x: 13, y: 0, lives: 3, stun: 0, invulnerable: 0, pontos: 0 })
      expect(broadcasts).toContainEqual(
         expect.objectContaining({ code, type: 'move-player', command: { type: 'move-player', playerId: 'playerA', keyPressed: 'ArrowRight' } })
      )
   })

   it('ignores move-player before joining a room', () => {
      socketA.fire('move-player', { keyPressed: 'ArrowRight' })
      expect(broadcasts).toHaveLength(0)
   })

   it('removes the player on disconnect', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code
      socketB.fire('join-room', { code })

      socketA.fire('disconnect')

      expect(roomManager.getRoom(code).state.players['playerA']).toBeUndefined()
      expect(roomManager.getRoom(code).state.players['playerB']).toBeDefined()
   })

   it('deletes the room when the last player disconnects', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code

      socketA.fire('disconnect')

      expect(roomManager.hasRoom(code)).toBe(false)
   })

   it('leave-room removes the player and deletes the empty room', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code

      socketA.fire('leave-room')

      expect(roomManager.hasRoom(code)).toBe(false)
      expect(socketA.rooms.has(code)).toBe(false)
      expect(socketA.gameRoom).toBeNull()
   })

   it('leave-room keeps the room when other players remain', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code
      socketB.fire('join-room', { code })

      socketA.fire('leave-room')

      expect(roomManager.hasRoom(code)).toBe(true)
      expect(roomManager.getRoom(code).state.players['playerB']).toBeDefined()
      expect(roomManager.getRoom(code).state.players['playerA']).toBeUndefined()
   })

   it('ignore leave-room before joining a room', () => {
      expect(() => socketA.fire('leave-room')).not.toThrow()
   })

   describe('lobby and host', () => {
      function playerListFor(code) {
         return [...broadcasts].reverse().find((b) => b.code === code && b.type === 'player-list')
      }

      it('makes the creator the host', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code

         expect(roomManager.getRoom(code).state.hostId).toBe('playerA')
         expect(playerListFor(code).command.hostId).toBe('playerA')
      })

      it('starts single rooms immediately and online rooms in the lobby', () => {
         socketA.fire('create-room', { mode: 'single' })
         expect(findSetup(socketA).payload.state.started).toBe(true)

         socketB.fire('create-room', { mode: 'online' })
         expect(findSetup(socketB).payload.state.started).toBe(false)
      })

      it('reassigns the host when the host leaves', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })

         socketA.fire('leave-room')

         expect(roomManager.getRoom(code).state.hostId).toBe('playerB')
         expect(playerListFor(code).command.hostId).toBe('playerB')
      })

      it('reassigns the host when the host disconnects', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })

         socketA.fire('disconnect')

         expect(roomManager.getRoom(code).state.hostId).toBe('playerB')
      })

      it('broadcasts a player list on join and leave', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code, name: 'Joao' })

         const list = playerListFor(code)
         expect(list.command.players).toEqual([
            { id: 'playerA', name: '', ready: false },
            { id: 'playerB', name: 'Joao', ready: false },
         ])
      })

      it('starts the game only when the host asks and all are ready', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })

         readyUp(socketB)
         socketA.fire('start-game')
         expect(roomManager.getRoom(code).state.started).toBe(false)

         readyUp(socketA)
         socketA.fire('start-game')
         expect(roomManager.getRoom(code).state.started).toBe(true)
         const start = broadcasts.find((b) => b.code === code && b.type === 'game-start')
         expect(start).toBeDefined()
         expect(start.command.state.started).toBe(true)
         expect(start.command.state.hostId).toBe('playerA')
      })

      it('resets the game state when starting', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })
         readyUp(socketA)
         readyUp(socketB)
         roomManager.getRoom(code).state.coins['c1'] = { x: 1, y: 1 }
         roomManager.getRoom(code).state.win = true

         socketA.fire('start-game')

         const game = roomManager.getRoom(code)
         expect(game.state.win).toBe(false)
         expect(game.state.coins['c1']).toBeUndefined()
         expect(game.state.players['playerA']).toEqual({ x: 12, y: 0, lives: 3, stun: 0, invulnerable: 0, pontos: 0 })
         expect(game.state.players['playerB']).toEqual({ x: 12, y: 0, lives: 3, stun: 0, invulnerable: 0, pontos: 0 })
      })

      it('requires every player to be ready before starting', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })
         readyUp(socketB)

         socketA.fire('start-game')

         expect(roomManager.getRoom(code).state.started).toBe(false)
      })

      it('resets readiness on start and end-game', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })
         readyUp(socketA)
         readyUp(socketB)

         socketA.fire('start-game')
         expect(roomManager.getRoom(code).state.ready).toEqual({})

         socketA.fire('end-game')
         expect(roomManager.getRoom(code).state.started).toBe(false)
         expect(roomManager.getRoom(code).state.ready).toEqual({ playerA: false, playerB: false })
      })

      it('tracks readiness per player in the lobby', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })

         readyUp(socketB)

         const list = playerListFor(code)
         expect(list.command.players.find(p => p.id === 'playerA').ready).toBe(false)
         expect(list.command.players.find(p => p.id === 'playerB').ready).toBe(true)
      })

      it('returns the room to the lobby with end-game (host only)', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         readyUp(socketA)
         socketA.fire('start-game')
         expect(roomManager.getRoom(code).state.started).toBe(true)

         socketA.fire('end-game')

         expect(roomManager.getRoom(code).state.started).toBe(false)
         expect(broadcasts.find((b) => b.code === code && b.type === 'game-end')).toBeDefined()
      })

      it('kicks a player only when the host asks', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })

         socketB.fire('kick-player', { playerId: 'playerA' })
         expect(roomManager.getRoom(code).state.players['playerA']).toBeDefined()

         socketA.fire('kick-player', { playerId: 'playerB' })
         expect(roomManager.getRoom(code).state.players['playerB']).toBeUndefined()
         expect(broadcasts.find((b) => b.code === code && b.type === 'kicked')).toBeDefined()
      })

      it('lets players join a room even after the game started', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code
         readyUp(socketA)
         socketA.fire('start-game')

         socketB.fire('join-room', { code })

         expect(findSetup(socketB).payload.state.started).toBe(true)
         expect(roomManager.getRoom(code).state.players['playerB']).toBeDefined()
      })

      it('ignores move-player for a player that left the game', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code

         socketA.fire('leave-room')
         expect(() => socketA.fire('move-player', { keyPressed: 'ArrowRight' })).not.toThrow()
      })

      it('ignores move-player while the room is in the lobby', () => {
         socketA.fire('create-room')
         const code = findSetup(socketA).payload.code

         socketA.fire('move-player', { keyPressed: 'ArrowRight' })

         expect(roomManager.getRoom(code).state.players['playerA'].x).toBe(12)
      })

      it('includes the map id in the player list', () => {
         socketA.fire('create-room', { mode: 'online', map: 'world1' })
         const code = findSetup(socketA).payload.code

         expect(playerListFor(code).command.mapId).toBe('world1')
      })

      it('lets the host change the map in the lobby', () => {
         socketA.fire('create-room', { mode: 'online' })
         const code = findSetup(socketA).payload.code

         socketA.fire('change-map', { map: 'world5' })

         expect(roomManager.getRoom(code).state.mapId).toBe('world5')
         expect(playerListFor(code).command.mapId).toBe('world5')
      })

      it('starts the game with the changed map', () => {
         socketA.fire('create-room', { mode: 'online' })
         const code = findSetup(socketA).payload.code
         readyUp(socketA)

         socketA.fire('change-map', { map: 'world1' })
         socketA.fire('start-game')

         const game = roomManager.getRoom(code)
         expect(game.state.mapId).toBe('world1')
         expect(game.state.screen).toEqual({ width: 50, height: 50 })
         expect(game.state.players['playerA']).toMatchObject({ x: 25, y: 43 })
      })

      it('ignores change-map from non-host players', () => {
         socketA.fire('create-room', { mode: 'online', map: 'world1' })
         const code = findSetup(socketA).payload.code
         socketB.fire('join-room', { code })

         socketB.fire('change-map', { map: 'world5' })

         expect(roomManager.getRoom(code).state.mapId).toBe('world1')
      })

      it('accepts any map id so custom maps can be used', () => {
         socketA.fire('create-room', { mode: 'online' })
         const code = findSetup(socketA).payload.code

         socketA.fire('change-map', { map: 'custom-xyz' })

         expect(roomManager.getRoom(code).state.mapId).toBe('custom-xyz')
      })

      it('creates a room with full map data for local maps', () => {
         const mapData = {
            name: 'Meu Mapa',
            state: { screen: { width: 8, height: 8 }, players: {}, walls: { 0: { x: 1, y: 1 } } },
            spawn: { x: 2, y: 2 },
         }
         socketA.fire('create-room', { mode: 'online', map: 'custom-local', mapData })

         const setup = findSetup(socketA)
         expect(setup.payload.state.screen).toEqual({ width: 8, height: 8 })
         expect(setup.payload.state.spawn).toEqual({ x: 2, y: 2 })
         expect(setup.payload.state.players['playerA']).toMatchObject({ x: 2, y: 2 })
         expect(roomManager.getRoom(setup.payload.code).state.mapData).toEqual(mapData)
      })

      it('uses the room map data when the host changes to a local map', () => {
         socketA.fire('create-room', { mode: 'online' })
         const code = findSetup(socketA).payload.code
         const mapData = {
            name: 'Local',
            state: { screen: { width: 6, height: 6 }, players: {}, walls: { 0: { x: 1, y: 1 } } },
            spawn: { x: 3, y: 3 },
         }

         socketA.fire('change-map', { map: 'custom-local', mapData })

         const preview = [...broadcasts].reverse().find((b) => b.code === code && b.type === 'map-preview')
         expect(preview.command.map.state.screen).toEqual({ width: 6, height: 6 })
         expect(roomManager.getRoom(code).state.mapData).toEqual(mapData)
      })

      it('restarts the game from the room map data', () => {
         const mapData = {
            name: 'Meu Mapa',
            state: { screen: { width: 8, height: 8 }, players: {}, walls: { 0: { x: 1, y: 1 } } },
            spawn: { x: 2, y: 2 },
         }
         socketA.fire('create-room', { mode: 'online', map: 'custom-local', mapData })
         const code = findSetup(socketA).payload.code
         readyUp(socketA)

         socketA.fire('start-game')

         const game = roomManager.getRoom(code)
         expect(game.state.screen).toEqual({ width: 8, height: 8 })
         expect(game.state.players['playerA']).toMatchObject({ x: 2, y: 2 })
      })

      it('broadcasts a map preview on create and on map change', () => {
         socketA.fire('create-room', { mode: 'online' })
         const code = findSetup(socketA).payload.code

         const preview = broadcasts.find((b) => b.code === code && b.type === 'map-preview')
         expect(preview).toBeDefined()
         expect(preview.command.map.state.screen).toEqual({ width: 25, height: 25 })

         socketA.fire('change-map', { map: 'world1' })
         const updated = [...broadcasts].reverse().find((b) => b.code === code && b.type === 'map-preview')
         expect(updated.command.map.state.screen).toEqual({ width: 50, height: 50 })
      })

      it('sends a map preview to players who join', () => {
         socketA.fire('create-room', { mode: 'online' })
         const code = findSetup(socketA).payload.code
         socketA.fire('change-map', { map: 'world1' })

         socketB.fire('join-room', { code })

         const preview = socketB.emitted.find((e) => e.event === 'map-preview')
         expect(preview).toBeDefined()
         expect(preview.payload.map.state.screen).toEqual({ width: 50, height: 50 })
      })
   })
})
