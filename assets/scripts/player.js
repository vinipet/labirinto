const canvaElement = document.getElementById('screen')
const screen = canvaElement.getContext('2d')



function createGame(){
   const state = {
      players: {
         'player1': {x:1, y:1}
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
      }
   }
   function movePlayer(command){
      const acceptedMoves = {
         ArrowUp(player){
            if(player.y-1 >=0){
               player.y = player.y-1
            }
         },
         ArrowRight(player){
            if(player.x+1<canvaElement.width){
               player.x =player.x+1
            }
         },
         ArrowDown(player){
            if(player.y+1<canvaElement.height){
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
      const moveFunction = acceptedMoves[keyPressed]

      if(moveFunction){
         moveFunction(player)
      }
      return //temp
   }
   
   return {
      movePlayer,
      state
   }
}

const game = createGame()
const keyboardListener = createKeyboardListener()
keyboardListener.subscribe(game.movePlayer)

function createKeyboardListener(){
   const state = {
      observers: []
   }

   function subscribe(observerFunction){
      state.observers.push(observerFunction)
   }

   function notifyAll(command){
      for(const observerFunction of state.observers){
         observerFunction(command)
      }
   }
   document.addEventListener('keydown', handleKeydown)
   
   function handleKeydown(event){
      const keyPressed = event.key 
      
      const command = {
         playerId: 'player1',
         keyPressed
      }
      notifyAll(command)
   }
   return {
      subscribe
   }
}

function renderScreen() {
   screen.fillStyle = 'wheat'
   screen.clearRect(0,0,25,25)
   
   for(const playerId in game.state.players){
      const player = game.state.players[playerId]
      screen.fillStyle = 'white'
      screen.fillRect(player.x, player.y, 1, 1)
   }

   for(const wallId in game.state.walls){
      const wall = game.state.walls[wallId]
      screen.fillStyle = 'black'
      screen.fillRect(wall.x, wall.y, wall.width, wall.height)
   }
   requestAnimationFrame(renderScreen)  
}

renderScreen()