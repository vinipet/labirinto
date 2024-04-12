import Express  from "express";
import http from 'http'
import CreateGame from '../public/assets/scripts/rules.js'
import {Server} from 'socket.io'

const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)
app.use(Express.static('public'))



import mundo from '../back-end/worldsMaps/mundo-test.js'

const game = CreateGame(mundo)
game.addPlayer({playerId:'player1' ,playerX:25, playerY:43})
game.movePlayer({playerId:'player1', keyPressed:'ArrowLeft'})

console.log(game.state)

sockets.on( 'connection', (socket)=>{
   const playerId = socket.id
   console.log(`> player conected on id ${playerId}`)

   socket.emit('setup', game.state)
})

server.listen(8080, ()=>{
   console.log('servidor ligado na porta 8080')
})