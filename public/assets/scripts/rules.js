export default function createGame(){
   let state = {
      pontos: 0,
      screen:{},
      players: {
         
      },
      walls: {
        
      },
      destiny: {
         '1': {x:24, y:24,},
      },
      coins: {
   
      },
      tp: {
        
      }
   }
   let contador= 0

   const observers = []

   function subscribe(observerFunction) {
      observers.push(observerFunction)
   }

   function notifyAll(command) {
      for (const observerFunction of observers) {
         observerFunction(command)
      }
   }

   function addPlayer(command) {
      const playerId = command.playerId
      const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
      const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

      state.players[playerId] = {
          x: playerX,
          y: playerY
      }

      notifyAll({
          type: 'add-player',
          playerId: playerId,
          playerX: playerX,
          playerY: playerY
      })
   }

   function removePlayer(command) {
      const playerId = command.playerId
      console.log(`removendo ${playerId}`)
      delete state.players[playerId]

      notifyAll({
          type: 'remove-player',
          playerId: playerId
      })
   }

   function setState(newState){
      Object.assign(state,newState)
   }
   
   function movePlayer(command){

      notifyAll(command)

      const acceptedMovements = {
         ArrowUp(player){

            if(player.y-1 >=0 && wall(0,-1,player) && win(0,-1,player)&& coin(0,-1,player) && tp(0,-1,player)){
               player.y = player.y-1
            }
         },
         ArrowRight(player){
            if(player.x+1<state.screen.width && wall(+1,0,player) && win(+1,0,player) && coin(+1,0,player) && tp(+1,0,player)){
               player.x =player.x+1
            }
         },
         ArrowDown(player){
            if(player.y+1<state.screen.height && wall(0,+1,player) && win(0,+1,player)&& coin(0,+1,player) && tp(0,+1,player)){
               player.y=player.y+1
            }
         },
         ArrowLeft(player){
            if(player.x-1>=0 && wall(-1,0,player) && win(-1,0,player)&& coin(-1,0,player) && tp(-1,0,player)){
               player.x=player.x-1
            }
         },
         b(player){
         const obj = JSON.stringify(state,0,1)
            console.log(obj)
         },
         m(player){
           let cordenadas = {x: player.x, y: player.y}
           state.walls[contador] = cordenadas 
           contador++
         }, 
         n(player){
            let cordenadas = {x: player.x, y: player.y}
            state.coins[contador] = cordenadas 
            contador++
         },
         c(player){
            console.log(`x:${player.x} y:${ player.y}`)
         },
         v(player){
            let cordenadas = {x: player.x, y: player.y}
            state.destiny[contador] = cordenadas 
            contador++
         },
         x(player){
            let x = player.x 
            let y = player.y
            let to ={
               'x':Number(prompt('digite a cordenada X')),
               'y':Number(prompt('digite a cordenada y'))
            }
            
            state.tp[contador] = {x, y, destino:to}
            contador++
            state.tp[contador] = to
            state.tp[contador].destino = {x,y}
            
         },
         u(player){
            console.log(player)

            // console.log(removePlayer({player:player}))
            
         },
         
         
      }
      const keyPressed = command.keyPressed
      const player = state.players[command.playerId]
      const moveFunction = acceptedMovements[keyPressed]

      if(moveFunction){
         moveFunction(player)
      }
     
   }
   
   function wall(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let NumWall in state.walls){
         let wall = state.walls[NumWall]
         if(posFutureX == wall.x && posFutureY == wall.y){ 
            result = false
         } else{}}
      return result
   }
   function win(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let NumWin in state.destiny){
         let win = state.destiny[NumWin]
         if(posFutureX == win.x && posFutureY == win.y){ 
            window.alert('vc ganhou')
            window.location.href = '../index.html'
         } else{}}
      return result
   }
   function coin(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let coinNUm in state.coins){
         let coin = state.coins[coinNUm]
         if(posFutureX == coin.x && posFutureY == coin.y){ 
            state.pontos ++
            coin.x = -1
            coin.y = -1
         } else{}}
      return result
   }
   function tp(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true

      for(let tpId in state.tp){
         let tp = state.tp[tpId]
         if(posFutureX == tp.x && posFutureY == tp.y){ 
            state.players.player1.x = tp.destino.x
            state.players.player1.y = tp.destino.y
            result = false
         } else{}}
      return result
   }

   return {
      movePlayer,
      addPlayer,
      removePlayer,
      movePlayer,
      subscribe,
      state,
      setState,
   }
  
}