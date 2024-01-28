export default function createGame(mundo){
   let state = mundo
   let contador= 336 
   function movePlayer(command){

      const acceptedMovements = {
         ArrowUp(player){

            if(player.y-1 >=0 && wall(0,-1) && win(0,-1)&& coin(0,-1) && tp(0,-1)){
               player.y = player.y-1
            }
         },
         ArrowRight(player){
            if(player.x+1<state.screen.width && wall(+1,0) && win(+1,0) && coin(+1,0) && tp(+1,0)){
               player.x =player.x+1
            }
         },
         ArrowDown(player){
            if(player.y+1<state.screen.height && wall(0,+1) && win(0,+1)&& coin(0,+1) && tp(0,+1)){
               player.y=player.y+1
            }
         },
         ArrowLeft(player){
            if(player.x-1>=0 && wall(-1,0) && win(-1,0)&& coin(-1,0) && tp(-1,0)){
               player.x=player.x-1
            }
         },
         b(player){
         const obj = JSON.stringify(state)
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
         }
         
         
      }
      const keyPressed = command.keyPressed
      const player = state.players[command.playerId]
      const moveFunction = acceptedMovements[keyPressed]

      if(moveFunction){
         moveFunction(player)
      }
     
   }
   
   return {
      movePlayer,
      state
   }
   
   function wall(commandX, commandY){
      const playerPos = state.players.player1
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
   function win(commandX, commandY){
      const playerPos = state.players.player1
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
   function coin(commandX, commandY){
      const playerPos = state.players.player1
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
   function tp(commandX, commandY){
      const playerPos = state.players.player1
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
}
