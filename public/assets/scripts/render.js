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
   { key: 'spikes', color: 'rgb(150, 0, 0)' },
   { key: 'pits', color: 'black' },
   { key: 'ice', color: 'rgb(170, 220, 240)' },
   { key: 'snares', color: 'rgb(120, 40, 120)' },
   { key: 'darts', color: 'rgb(255, 140, 0)' },
   { key: 'bombs', color: 'rgb(200, 60, 60)' },
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

   const currentPlayer = game.state.players[currentPlayerId]
   let ponto = document.getElementById('points')
   const lives = currentPlayer ? currentPlayer.lives : 3
   ponto.innerHTML = `Você tem ${game.state.pontos} pontos • Vidas: ${lives}/3`

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

   if(currentPlayer){
      const rect = tileToPixelRect(currentPlayer)
      screen.fillStyle = '#00ffff'
      screen.fillRect(rect.x, rect.y, rect.width, rect.height)
   }

   for(const projectileId in game.state.projectiles){
      const projectile = game.state.projectiles[projectileId]
      const rect = tileToPixelRect(projectile)
      const inset = Math.round(rect.width / 4)
      screen.fillStyle = 'rgb(255, 140, 0)'
      screen.fillRect(rect.x + inset, rect.y + inset, rect.width - inset * 2, rect.height - inset * 2)
   }

   for(const shockwaveId in game.state.shockwaves){
      const shockwave = game.state.shockwaves[shockwaveId]
      const centerX = shockwave.x * TILE_SIZE + TILE_SIZE / 2
      const centerY = shockwave.y * TILE_SIZE + TILE_SIZE / 2
      const radius = shockwave.radius * TILE_SIZE
      screen.fillStyle = 'rgba(255, 100, 0, 0.2)'
      screen.beginPath()
      screen.arc(centerX, centerY, radius, 0, Math.PI * 2)
      screen.fill()
      screen.strokeStyle = 'rgba(255, 140, 0, 0.9)'
      screen.lineWidth = 2
      screen.beginPath()
      screen.arc(centerX, centerY, radius, 0, Math.PI * 2)
      screen.stroke()
   }

   for(const playerId in game.state.players){
      const player = game.state.players[playerId]
      if(player.stun > 0){
         const rect = tileToPixelRect(player)
         screen.fillStyle = 'rgba(120, 40, 120, 0.55)'
         screen.fillRect(rect.x, rect.y, rect.width, rect.height)
         screen.strokeStyle = 'rgba(220, 180, 255, 0.9)'
         screen.lineWidth = 1
         const centerX = rect.x + rect.width / 2
         const centerY = rect.y + rect.height / 2
         for(let i = 0; i < 4; i++){
            const angle = (i / 4) * Math.PI * 2
            screen.beginPath()
            screen.moveTo(centerX, centerY)
            screen.lineTo(centerX + Math.cos(angle) * rect.width / 2, centerY + Math.sin(angle) * rect.height / 2)
            screen.stroke()
         }
         screen.strokeRect(rect.x + 3, rect.y + 3, rect.width - 6, rect.height - 6)
      }
   }

   requestAnimationFrame(() => {
      renderScreen(screen, game, requestAnimationFrame, currentPlayerId)
  })
}
