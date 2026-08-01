import Express  from "express";
import http from 'http'
import {Server} from 'socket.io'
import { createRoomManager } from './roomManager.js'
import handleConnection from './connectionHandler.js'

const app = Express()
const server = http.createServer(app)
const sockets = new Server(server)
app.use(Express.static('public'))

const roomManager = createRoomManager()


sockets.on( 'connection', (socket)=>{
   handleConnection(socket, {
      roomManager,
      broadcast: (code, type, command) => sockets.to(code).emit(type, command),
   })
})



server.listen(8080, ()=>{
   console.log('servidor ligado na porta 8080')
})
