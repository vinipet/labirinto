export default function handleConnection(socket, { roomManager, broadcast }) {
   const playerId = socket.id
   console.log(`> player conected on id ${playerId}`)

   function getName(command) {
      return typeof command?.name === 'string' ? command.name.trim() : ''
   }

   socket.on('create-room', (command = {}) => {
      const mode = command.mode === 'single' ? 'single' : 'online'
      const { code, game } = roomManager.createRoom(mode, command.map)

      game.subscribe((command) => {
         console.log(`> emitting ${command.type} in room ${code}`)
         broadcast(code, command.type, command)
      })

      socket.join(code)
      socket.gameRoom = code
      const spawn = game.state.spawn || { x: 12, y: 0 }
      game.addPlayer({ playerId, playerX: spawn.x, playerY: spawn.y, name: getName(command) })

      socket.emit('setup', { code, state: game.state })
   })

   socket.on('join-room', (command) => {
      const code = String(command.code || '').trim().toUpperCase()
      const game = roomManager.getRoom(code)

      if(!game || game.state.mode === 'single'){
         socket.emit('room-not-found', { code })
         return
      }

      socket.join(code)
      socket.gameRoom = code
      const spawn = game.state.spawn || { x: 12, y: 0 }
      game.addPlayer({ playerId, playerX: spawn.x, playerY: spawn.y, name: getName(command) })

      socket.emit('setup', { code, state: game.state })
   })

   socket.on('disconnect', () => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game) return

      game.removePlayer({playerId:playerId})

      if(Object.keys(game.state.players).length === 0){
         roomManager.deleteRoom(code)
         console.log(`> sala ${code} deletada`)
      }
   })

   socket.on('move-player', (command)=>{
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game) return

      command.playerId = playerId
      command.type = 'move-player'
      game.movePlayer(command)
   })
}
