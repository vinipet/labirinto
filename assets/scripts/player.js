const canvaElement = document.getElementById('screen')
const screen = canvaElement.getContext('2d')

const cor = 'blue'
const positionX = 0
const positionY = 0
const width = 250
const height = 250

const game = {
   players: {
      'player1': {x:1, y:1}
   },
   walls: {
      'wall1': {x:4, y:7}
   }
}


renderScreen()
function renderScreen() {
   for(playerId in game.players){
      const player = game.players[playerId]
      screen.fillStyle = 'white'
      screen.fillRect(player.x, player.y, 10,10)
   }

   for(wallId in game.walls){
      const wall = game.walls[wallId]
      screen.fillStyle = 'black'
      screen.fillRect(wall.x, wall.y,10,10)
   }
}