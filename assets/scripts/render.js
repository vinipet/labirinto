export default function renderScreen(screen, game, requestAnimationFrame) {
   screen.fillStyle = 'white'
   screen.clearRect(0,0,25,25)
   
   for(const playerId in game.state.players){
      const player = game.state.players[playerId]
      screen.fillStyle = 'blue'
      screen.fillRect(player.x, player.y, 1, 1)
   }

   for(const wallId in game.state.walls){
      const wall = game.state.walls[wallId]
      screen.fillStyle = 'white'
      screen.fillRect(wall.x, wall.y, 1, 1)
   }
   
   for(const destinyId in game.state.destiny){
      const destiny = game.state.destiny[destinyId]
      screen.fillStyle = 'green'
      screen.fillRect(destiny.x, destiny.y, destiny.width, destiny.height)
   }
   requestAnimationFrame(() => {
      renderScreen(screen, game, requestAnimationFrame)
  })
}