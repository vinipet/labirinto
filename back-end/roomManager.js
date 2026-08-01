import CreateGame from '../public/assets/scripts/rules.js'
import mundo from './worldsMaps/wolrd3.js'

const CODE_LENGTH = 5
const CODE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

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
      createRoom() {
         const code = generateRoomCode(new Set(rooms.keys()))
         const game = CreateGame()
         game.setState(structuredClone(mundo))
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
