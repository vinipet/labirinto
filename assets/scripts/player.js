const canvaElement = document.getElementById('screen')
const screen = canvaElement.getContext('2d')

const game = {
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


renderScreen()
function renderScreen() {
   screen.fillStyle = 'wheat'
   screen.clearRect(0,0,25,25)

   for(const playerId in game.players){
      const player = game.players[playerId]
      screen.fillStyle = 'white'
      screen.fillRect(player.x, player.y, 1, 1)
   }

   for(const wallId in game.walls){
      const wall = game.walls[wallId]
      screen.fillStyle = 'black'
      screen.fillRect(wall.x, wall.y, wall.width, wall.height)
   }
   requestAnimationFrame(renderScreen)  
}
