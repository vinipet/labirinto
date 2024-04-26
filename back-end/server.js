import Express  from "express";
import http from 'http'
import CreateGame from '../public/assets/scripts/rules.js'
import {Server} from 'socket.io'

const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)
app.use(Express.static('public'))




import mundo from '../back-end/worldsMaps/wolrd3.js'
const game = CreateGame()
game.setState(mundo)
console.log(game.state)

game.subscribe((command)=>{
   console.log(`> emitting ${command.type}`)
   sockets.emit(command.type, command)
})


sockets.on( 'connection', (socket)=>{
   const playerId = socket.id
   console.log(`> player conected on id ${playerId}`)

   game.addPlayer({playerId:playerId, playerX:12,playerY:0})
   console.log(game.state)

   socket.emit('setup', game.state)

   socket.on('disconnect', () => {
      game.removePlayer({playerId:playerId})
   })

   socket.on('move-player', (command)=>{
      command.playerId = playerId
      command.type = 'move-player'
      game.movePlayer(command)
   })

})



server.listen(8080, ()=>{
   console.log('servidor ligado na porta 8080')
})