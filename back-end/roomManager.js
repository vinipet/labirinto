import CreateGame from '../public/assets/scripts/rules.js'
import wolrd1 from './worldsMaps/wolrd1.js'
import wolrd2 from './worldsMaps/wolrd2.js'
import wolrd3 from './worldsMaps/wolrd3.js'
import wolrd4 from './worldsMaps/wolrd4.js'
import world5 from './worldsMaps/world5.js'
import wolrd6 from './worldsMaps/wolrd6.js'

const CODE_LENGTH = 5
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export const worldMaps = {
   world1: { name: 'Sweety Heart', state: wolrd1, spawn: { x: 25, y: 43 } },
   world2: { name: 'Caverna das Moedas', state: wolrd2, spawn: { x: 12, y: 0 } },
   world3: { name: 'Corredor Secreto', state: wolrd3, spawn: { x: 12, y: 0 } },
   world4: { name: 'Mundo 4', state: wolrd4, spawn: { x: 12, y: 0 } },
   world5: { name: 'Mundo 5', state: world5, spawn: { x: 12, y: 0 } },
   world6: { name: 'Mundo 6', state: wolrd6, spawn: { x: 12, y: 0 } },
}

export function getWorldMap(mapId) {
   return worldMaps[mapId] || worldMaps.world3
}

export function getWorldList() {
   return Object.entries(worldMaps).map(([id, world]) => ({
      id,
      name: world.name,
      state: world.state,
   }))
}

export function generateRoomCode(existingRooms = new Set()) {
   let code
   do {
      code = Array.from(
         { length: CODE_LENGTH },
         () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
      ).join('')
   } while (existingRooms.has(code))
   return code
}

export function createRoomManager() {
   const rooms = new Map()

   return {
      createRoom(mode = 'online', mapId = 'world3') {
         const code = generateRoomCode(new Set(rooms.keys()))
         const game = CreateGame()
         const world = getWorldMap(mapId)
         game.setState(structuredClone(world.state))
         game.state.mode = mode
         game.state.spawn = { ...world.spawn }
         rooms.set(code, game)
         return { code, game }
      },
      getRoom(code) {
         return rooms.get(code)
      },
      hasRoom(code) {
         return rooms.has(code)
      },
      deleteRoom(code) {
         return rooms.delete(code)
      },
   }
}
