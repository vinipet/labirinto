export default function createGame(){
   const state = {
      screen:{width:25, height:25},
      players: {
         'player1': {x:0, y:12}
      },
      walls: {
         'wall1': {x:0, y:0, height: 1, width:25},
         'wall2': {x:0, y:0, height: 12, width:1},
         'wall3': {x:0, y:13, height: 12, width:1},
         'wall4': {x:24, y:0, height: 12, width:1},
         'wall5': {x:24, y:13, height: 12, width:1},
         'wall6': {x:0, y:24, height: 1, width:25},
         'wall7': {x:0, y:13, height: 1, width:10},
         'wall8': {x:0, y:11, height: 1, width:10},
      },
      destiny: {
         '1': {x:24, y:12, height:1, width:1}
      }
   }
   function movePlayer(command){

      const acceptedMovements = {
         ArrowUp(player){
            if(player.y-1 >=0){
               player.y = player.y-1
            }
         },
         ArrowRight(player){
            if(player.x+1<state.screen.width){
               player.x =player.x+1
            }
         },
         ArrowDown(player){
            if(player.y+1<state.screen.height){
               player.y=player.y+1
            }
         },
         ArrowLeft(player){
            if(player.x-1>=0){
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

function wall(side){
   for(const wall in game.state.walls){
      return walls.side
   }
}