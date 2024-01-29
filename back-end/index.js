import  Express  from "express";
import http from 'http'
import CreateGame from '../public/assets/scripts/rules.js'

const app = Express()
const server = http.createServer(app)

app.use(Express.static('public'))




const game = CreateGame()

console.log(game)




server.listen(8080, ()=>{
   console.log('servidor ligado na porta 8080')
})