export const TILE_SIZE = 16

export function tileToPixelRect(tile, scale = 1) {
   return {
      x: tile.x * TILE_SIZE * scale,
      y: tile.y * TILE_SIZE * scale,
      width: TILE_SIZE * scale,
      height: TILE_SIZE * scale
   }
}

const LAYERS = [
   { key: 'walls', color: 'white' },
   { key: 'boxes', color: 'rgb(101, 67, 33)' },
   { key: 'door', color: '#a5c9ca' },
   { key: 'keydoor', color: 'rgb(128, 0, 128)' },
   { key: 'plate', color: '#808080' },
   { key: 'destiny', color: 'green' },
   { key: 'coins', color: 'rgb(173, 173, 22)' },
   { key: 'keys', color: 'rgb(255, 215, 0)' },
   { key: 'tp', color: 'brown' },
]

export function drawTiles(screen, state, scale = 1, colors = {}) {
   for (const layer of LAYERS) {
      screen.fillStyle = colors[layer.key] || layer.color
      for (const tileId in state[layer.key]) {
         const tile = state[layer.key][tileId]
         const rect = tileToPixelRect(tile, scale)
         screen.fillRect(rect.x, rect.y, rect.width, rect.height)
      }
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

   drawTiles(screen, game.state)

   for(const playerId in game.state.players){
      const player = game.state.players[playerId]
      const rect = tileToPixelRect(player)
      screen.fillStyle = 'blue'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
      if(player.name){
         screen.save()
         screen.globalCompositeOperation = 'difference'
         screen.fillStyle = 'white'
         screen.font = 'bold 8px monospace'
         screen.textAlign = 'center'
         screen.fillText(player.name, rect.x + rect.width / 2, rect.y - 2)
         screen.restore()
      }
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
