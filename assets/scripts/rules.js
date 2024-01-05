export default function createGame(){
   const state = {
      screen:{width:25, height:25},
      players: {
         'player1': {x:0, y:12}
      },
      walls: {
         'wall1': {x:1, y:12,},
         'wall2': {x:3, y:12}
      },
      destiny: {
         '1': {x:24, y:12, height:1, width:1}
      }
   }
   function movePlayer(command){

      const acceptedMovements = {
         ArrowUp(player){
            if(player.y-1 >=0 && wall(0,-1) && win(0,-1)){
               player.y = player.y-1
            }
         },
         ArrowRight(player){
            if(player.x+1<state.screen.width && wall(+1,0) && win(+1,0)){
               player.x =player.x+1
            }
         },
         ArrowDown(player){
            if(player.y+1<state.screen.height && wall(0,+1) && win(0,+1)){
               player.y=player.y+1
            }
         },
         ArrowLeft(player){
            if(player.x-1>=0 && wall(-1,0) && win(-1,0)){
               player.x=player.x-1
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
}

function wall(commandX, commandY){
   const playerPos = state.players.player1
   
   for(let sla in state.walls){
      let wall = state.walls[sla]
      if((playerPos.x + commandX) == wall.x && (playerPos.y + commandY)== wall.y){ 
         return false
      } else{
         return true
      }
   }
}

function win(commandX, commandY){
   const playerPos = state.players.player1
   
   for(let sla in state.destiny){
      let end = state.destiny[sla]
      if((playerPos.x + commandX) == end.x && (playerPos.y + commandY)== end.y){ 
         window.alert('foi')
      } else{
         return true
      }
   }
}
