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

   it('creates a room and sends setup with a unique code', () => {
      socketA.fire('create-room')

      const setup = findSetup(socketA)
      expect(setup).toBeDefined()
      expect(setup.payload.code).toMatch(/^[A-Z0-9]{5}$/)
      expect(roomManager.hasRoom(setup.payload.code)).toBe(true)
      expect(socketA.rooms.has(setup.payload.code)).toBe(true)
      expect(socketA.gameRoom).toBe(setup.payload.code)
      expect(setup.payload.state.players['playerA']).toEqual({ x: 12, y: 0 })
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
      expect(roomManager.getRoom(code).state.players['playerB']).toEqual({ x: 12, y: 0 })
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

   it('routes move-player to the correct room game', () => {
      socketA.fire('create-room')
      const code = findSetup(socketA).payload.code

      socketA.fire('move-player', { keyPressed: 'ArrowRight' })

      expect(roomManager.getRoom(code).state.players['playerA']).toEqual({ x: 13, y: 0 })
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
})
