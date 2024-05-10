import Express  from "express";
import http from 'http'
import CreateGame from '../public/assets/scripts/rules.js'
import {Server} from 'socket.io'
import mundo1 from '../back-end/worldsMaps/wolrd1.js'
import path from 'path'



const __dirname = path.resolve()
const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)

app.use(Express.static('public'))

const mundo = []
mundo.push(mundo1)

app.post('/play', function(req, res){

   console.log(req.se)

   
   res.sendFile(__dirname + '/public/pages/play.html')
   const game = CreateGame()
   game.setState(mundo[0])
   // console.log(game.state)
   
   game.subscribe((command)=>{
      // console.log(`> emitting ${command.type}`)
      sockets.emit(command.type, command)
   })
   
   
   sockets.on( 'connection', (socket)=>{
      const playerId = socket.id
      // console.log(`> player conected on id ${playerId}`)
   
      game.addPlayer({playerId:playerId, playerX:0,playerY:0})
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
   
})





server.listen(8080, ()=>{
   console.log('servidor ligado na porta 8080')
})