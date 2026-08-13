import Express  from "express";
import http from 'http'
import {Server} from 'socket.io'
import { createRoomManager, getWorldList } from './roomManager.js'
import handleConnection from './connectionHandler.js'

const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)
app.use(Express.static('public'))

app.get('/api/worlds', (req, res) => {
   res.json(getWorldList())
})

const roomManager = createRoomManager()

const TICK_INTERVAL_MS = 150
setInterval(() => {
   roomManager.tickAll()
}, TICK_INTERVAL_MS)

sockets.on( 'connection', (socket)=>{
   handleConnection(socket, {
      roomManager,
      broadcast: (code, type, command) => sockets.to(code).emit(type, command),
   })
})



server.listen(8080, ()=>{
   console.log('servidor ligado na porta 8080')
})
