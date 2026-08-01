export const TILE_SIZE = 16

export function tileToPixelRect(tile) {
   return {
      x: tile.x * TILE_SIZE,
      y: tile.y * TILE_SIZE,
      width: TILE_SIZE,
      height: TILE_SIZE
   }
}

export default function renderScreen(screen, game, requestAnimationFrame, currentPlayerId) {

   const canvas = screen.canvas
   const screenSize = game.state.screen

   if(screenSize.width && screenSize.height){
      const width = screenSize.width * TILE_SIZE
      const height = screenSize.height * TILE_SIZE
      if(canvas.width !== width) canvas.width = width
      if(canvas.height !== height) canvas.height = height
   }

   let ponto = document.getElementById('points')
   ponto.innerHTML= `Você tem ${game.state.pontos} pontos`

   screen.fillStyle = 'white'
   screen.clearRect(0,0,canvas.width,canvas.height)
   
   for(const wallId in game.state.walls){
      const wall = game.state.walls[wallId]
      const rect = tileToPixelRect(wall)
      screen.fillStyle = 'white'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }
   for(const doorId in game.state.door){
      const door = game.state.door[doorId]
      const rect = tileToPixelRect(door)
      screen.fillStyle = '#a5c9ca'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }
   for(const plateId in game.state.plate){
      const plate = game.state.plate[plateId]
      const rect = tileToPixelRect(plate)
      screen.fillStyle = '#808080'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }
   for(const destinyId in game.state.destiny){
      const destiny = game.state.destiny[destinyId]
      const rect = tileToPixelRect(destiny)
      screen.fillStyle = 'green'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }
   for(const coinId in game.state.coins){
      const coin = game.state.coins[coinId]
      const rect = tileToPixelRect(coin)
      screen.fillStyle = 'rgb(173, 173, 22)'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }
   for(const tpId in game.state.tp){
      const tp = game.state.tp[tpId]
      const rect = tileToPixelRect(tp)
      screen.fillStyle = 'brown'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }
   for(const playerId in game.state.players){
      const player = game.state.players[playerId]
      const rect = tileToPixelRect(player)
      screen.fillStyle = 'blue'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }

   const currentPlayer = game.state.players[currentPlayerId]
   if(currentPlayer){
      const rect = tileToPixelRect(currentPlayer)
      screen.fillStyle = '#00ffff'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }

   requestAnimationFrame(() => {
      renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
  })
}
