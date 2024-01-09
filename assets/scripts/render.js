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
      screen.fillRect(destiny.x, destiny.y,1,1)
   }
   for(const coinId in game.state.coins){
      const coin = game.state.coins[coinId]
      screen.fillStyle = 'rgb(173, 173, 22)'
      screen.fillRect(coin.x, coin.y,1,1)
   }
   for(const tpId in game.state.tp){
      const tp = game.state.tp[tpId]
      screen.fillStyle = 'brown'
      screen.fillRect(tp.x, tp.y,1,1)
   }
   requestAnimationFrame(() => {
      renderScreen(screen, game, requestAnimationFrame)
  })
}