import { getWorldMap } from './roomManager.js'

export default function handleConnection(socket, { roomManager, broadcast }) {
   const playerId = socket.id
   console.log(`> player conected on id ${playerId}`)

   function getName(command) {
      return typeof command?.name === 'string' ? command.name.trim() : ''
   }

   function buildPlayerList(game) {
      return {
         hostId: game.state.hostId,
         started: game.state.started,
         mapId: game.state.mapId,
         players: Object.entries(game.state.players).map(([id, p]) => ({ id, name: p.name || '', ready: !!game.state.ready[id] })),
      }
   }

   function roomWorld(game) {
      return game.state.mapData || getWorldMap(game.state.mapId)
   }

   function markNotReady(game) {
      game.state.ready = {}
      for(const id in game.state.players){
         game.state.ready[id] = false
      }
   }

   function allPlayersReady(game) {
      const ids = Object.keys(game.state.players)
      return ids.length > 0 && ids.every(id => game.state.ready[id])
   }

   function leaveRoom(code) {
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game) return

      game.removePlayer({ playerId })
      delete game.state.ready[playerId]

      if(game.state.hostId === playerId){
         game.state.hostId = Object.keys(game.state.players)[0] || null
      }

      socket.leave(code)
      socket.gameRoom = null

      if(Object.keys(game.state.players).length === 0){
         roomManager.deleteRoom(code)
         console.log(`> sala ${code} deletada`)
      } else {
         broadcast(code, 'player-list', buildPlayerList(game))
      }
   }

   socket.on('create-room', (command = {}) => {
      const mode = command.mode === 'single' ? 'single' : 'online'
      const { code, game } = roomManager.createRoom(mode, command.map, command.mapData)

      game.subscribe((command) => {
         console.log(`> emitting ${command.type} in room ${code}`)
         broadcast(code, command.type, command)
      })

      socket.join(code)
      socket.gameRoom = code
      const spawn = game.state.spawn || { x: 12, y: 0 }
      game.addPlayer({ playerId, playerX: spawn.x, playerY: spawn.y, name: getName(command) })
      game.state.hostId = playerId
      game.state.started = mode === 'single'
      game.state.ready[playerId] = false

      socket.emit('setup', { code, state: game.state })
      if(mode === 'online'){
         broadcast(code, 'map-preview', { map: roomWorld(game) })
      }
      broadcast(code, 'player-list', buildPlayerList(game))
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
      game.state.ready[playerId] = false

      socket.emit('setup', { code, state: game.state })
      socket.emit('map-preview', { map: roomWorld(game) })
      broadcast(code, 'player-list', buildPlayerList(game))
   })

   socket.on('disconnect', () => {
      leaveRoom(socket.gameRoom)
   })

   socket.on('leave-room', () => {
      leaveRoom(socket.gameRoom)
   })

   socket.on('ready-up', (command) => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game || game.state.mode === 'single' || !game.state.players[playerId]) return

      game.state.ready[playerId] = !!command?.ready
      broadcast(code, 'player-list', buildPlayerList(game))
   })

   socket.on('start-game', () => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game || game.state.mode === 'single' || game.state.hostId !== playerId) return
      if(!allPlayersReady(game)) return

      restartGame(game)
      broadcast(code, 'game-start', { state: game.state })
   })

   socket.on('change-map', (command) => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game || game.state.mode === 'single' || game.state.hostId !== playerId) return
      const mapId = command?.map
      if(!mapId) return

      game.state.mapId = mapId
      game.state.mapData = command?.mapData || null
      broadcast(code, 'map-preview', { map: roomWorld(game) })
      broadcast(code, 'player-list', buildPlayerList(game))
   })

   socket.on('end-game', () => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game || game.state.mode === 'single' || game.state.hostId !== playerId) return

      game.state.started = false
      game.state.win = false
      game.state.gameOver = false
      markNotReady(game)
      broadcast(code, 'game-end', { state: game.state })
      broadcast(code, 'player-list', buildPlayerList(game))
   })

   socket.on('kick-player', (command) => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game || game.state.mode === 'single' || game.state.hostId !== playerId) return
      const targetId = command?.playerId
      if(!targetId || targetId === playerId) return

      game.removePlayer({ playerId: targetId })
      delete game.state.ready[targetId]
      broadcast(code, 'kicked', { playerId: targetId })
      broadcast(code, 'player-list', buildPlayerList(game))
   })

   socket.on('move-player', (command) => {
      const code = socket.gameRoom
      if(!code) return
      const game = roomManager.getRoom(code)
      if(!game || game.state.started === false || !game.state.players[playerId]) return

      command.playerId = playerId
      command.type = 'move-player'
      game.movePlayer(command)
   })

   function restartGame(game) {
      const players = Object.entries(game.state.players).map(([id, p]) => ({ id, name: p.name || '' }))
      const world = roomWorld(game)
      game.setState(structuredClone(world.state))
      game.state.spawn = { ...world.spawn }
      game.state.started = true
      game.state.gameOver = false
      game.state.win = false
      game.state.players = {}
      for(const { id, name } of players){
         game.state.players[id] = {
            x: game.state.spawn.x,
            y: game.state.spawn.y,
            lives: 3,
            stun: 0,
            invulnerable: 0,
            pontos: 0
         }
         if(name) game.state.players[id].name = name
      }
      game.state.ready = {}
   }
}
