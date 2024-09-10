import Express  from "express";
import http from 'http'
import CreateGame from '../public/assets/scripts/rules.js'
import {Server} from 'socket.io'
import path, { join } from 'path'
import multer from 'multer'
import mundo1 from '../back-end/worldsMaps/wolrd1.js'
import { FORMERR } from "dns";


const __dirname = path.resolve()
const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)
const upload = multer();

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(Express.static('public'))

 
const OpenRooms = [
   { name: 'Host', host: undefined },
   { name: 'mandragora', host: undefined },
   { name: 'pinto', host: undefined },
   { name: 'buceta', host: undefined },
]
const mundo = []

mundo.push(mundo1)


class Room {
   constructor(name, password, host) {
      this.name = name;
      this.host = host;
   }
}



app.post('/create', upload.none(), (req, res) => {


   
   console.log(OpenRooms)
});

app.post('/join', (req,res)=>{
const data = req.body

   for(const ROOM of OpenRooms){
      if(ROOM.name == data.name){
         if(ROOM.password == data.password){
            res.send('connected') 
         }
      }
   }
})

app.post('/play', function(req, res, next){
   
   const room = req.name
   
   res.sendFile(__dirname + '/public/pages/play.html')
   
   const game = CreateGame()
   game.setState(mundo[0])
   
   game.subscribe((command)=>{
      sockets.emit(command.type, command)
   })
   
   
   sockets.on( 'connection', (socket)=>{
      const playerId = socket.id

      socket.join(`${room}`)

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