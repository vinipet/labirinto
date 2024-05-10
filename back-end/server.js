import Express  from "express";
import http from 'http'
import CreateGame from '../public/assets/scripts/rules.js'
import {Server} from 'socket.io'
import mundo1 from '../back-end/worldsMaps/wolrd1.js'
import path from 'path'
import multer from 'multer'

const __dirname = path.resolve()
const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)
const upload = multer();


app.use(Express.urlencoded({ extended: true }));
app.use(Express.json());
app.use(Express.static('public'))

 

const mundo = []
mundo.push(mundo1)


const OpenRooms = {
   'vinipett': {
      name:'vinipett',
      password:'454353'
   }
}

app.post('/create', upload.none(), (req, res) => {
   const RoomName = req.body.createRoomName
   const RoomPassword = req.body.creatRoomPassword

   console.log(req.body)
   for(const roons in OpenRooms){
      if(roons == RoomName){
         res.send('connected')
         return
      }
   }
   
});

app.get('/play', function(req, res){


   
   res.sendFile(__dirname + '/public/pages/play.html')
   const game = CreateGame()
   game.setState(mundo[0])
   
   game.subscribe((command)=>{
      sockets.emit(command.type, command)
   })
   
   
   sockets.on( 'connection', (socket)=>{
      const playerId = socket.id
   
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