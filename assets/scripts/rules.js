export default function createGame(){
   const state = {
      screen:{width:25, height:25},
      players: {
         'player1': {x:2, y:11   }
      },
      walls: {
         'wall1': {x:1, y:12,},
         'wall2': {x:2, y:12,},
      },
      destiny: {
         '1': {x:24, y:12, height:1, width:1},
         '4': {x:24, y:13, height:1, width:1},
      }
   }
   function movePlayer(command){

      const acceptedMovements = {
         ArrowUp(player){
            if(player.y-1 >=0 && wall(0,-1) && win(0,-1)){
               player.y = player.y-1
               console.log(`movimento executado com sucesso `)
            }
         },
         ArrowRight(player){
            if(player.x+1<state.screen.width && wall(+1,0) && win(+1,0)){
               player.x =player.x+1
               console.log(`movimento executado com sucesso `)
            }
         },
         ArrowDown(player){
            if(player.y+1<state.screen.height && wall(0,+1) && win(0,+1)){
               player.y=player.y+1
               console.log(`movimento executado com sucesso  `)
            }
         },
         ArrowLeft(player){
            if(player.x-1>=0 && wall(-1,0) && win(-1,0)){
               player.x=player.x-1
               console.log(`movimento executado com sucesso `)
            }
         },
         
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
         } else{}}
      return result
   }
}
