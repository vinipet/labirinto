const canvaElement = document.getElementById('screen')
const screen = canvaElement.getContext('2d')

const game = {
   players: {
      'player1': {x:1, y:1}
   },
   walls: {
      'wall1': {x:0, y:0, height: 1, width:1}
   }
}


renderScreen()
function renderScreen() {
   for(playerId in game.players){
      const player = game.players[playerId]
      screen.fillStyle = 'white'
      screen.fillRect(player.x, player.y, 1, 1)
   }

   for(wallId in game.walls){
      const wall = game.walls[wallId]
      screen.fillStyle = 'black'
      screen.fillRect(wall.x, wall.y, wall.width, wall.height)
   }
   requestAnimationFrame(renderScreen)
}
