export default function createGame(){
   let state = {
      mode: 'online',
      gameOver: false,
      win: false,
      screen:{},
      players: {

      },
      door:{
         door1: { x: 12, y: 9 },
       },
      plate:{
         plate1: { x: 12, y: 1, door: 'door1' },
       },
      keydoor: {
        
      },
      keys: {
        
      },
      inventory: {
        
      },
      walls: {
        
      },
      boxes: {
        
      },
      destiny: {
         '1': { x: 24, y: 24 },
       },
      coins: {
   
      },
      tp: {
         
      },
      spikes: {

      },
      pits: {

      },
      ice: {

      },
      snares: {

      },
      darts: {

      },
      bombs: {

      },
      projectiles: {

      },
      shockwaves: {

      },
      slides: {

      },
      boxSlides: {

      }
   }
   const DART_DEFAULT_COOLDOWN = 4
   let projectileIdCounter = 0
   let shockwaveIdCounter = 0

   const observers = []

   function subscribe(observerFunction) {
      observers.push(observerFunction)
   }

   function notifyAll(command) {
      for (const observerFunction of observers) {
         observerFunction(command)
      }
   }

   function addPlayer(command) {
      const playerId = command.playerId
      const playerX = 'playerX' in command ? command.playerX : Math.floor(Math.random() * state.screen.width)
      const playerY = 'playerY' in command ? command.playerY : Math.floor(Math.random() * state.screen.height)

      state.players[playerId] = {
          x: playerX,
          y: playerY,
          lives: 3,
          stun: 0,
          invulnerable: 0,
          pontos: 0
      }
      if(command.name){
         state.players[playerId].name = command.name
      }

      notifyAll({
          type: 'add-player',
          playerId: playerId,
          playerX: playerX,
          playerY: playerY,
          name: command.name || ''
      })
   }

   function removePlayer(command) {
      const playerId = command.playerId
      console.log(`removendo ${playerId}`)
      delete state.players[playerId]

      notifyAll({
          type: 'remove-player',
          playerId: playerId
      })
   }

   function setState(newState){
      Object.assign(state,newState)
   }
   
   function movePlayer(command){
      notifyAll(command)

       const acceptedMovements = {
         ArrowUp(player){
            if(canMove(0, -1, player)){
               player.y = player.y - 1
               beginSlide(0, -1, player)
            }
         },
         ArrowRight(player){
            if(canMove(1, 0, player)){
               player.x = player.x + 1
               beginSlide(1, 0, player)
            }
         },
         ArrowDown(player){
            if(canMove(0, 1, player)){
               player.y = player.y + 1
               beginSlide(0, 1, player)
            }
         },
         ArrowLeft(player){
            if(canMove(-1, 0, player)){
               player.x = player.x - 1
               beginSlide(-1, 0, player)
            }
         },
       }

       acceptedMovements['w'] = acceptedMovements['ArrowUp']
       acceptedMovements['s'] = acceptedMovements['ArrowDown']
       acceptedMovements['a'] = acceptedMovements['ArrowLeft']
       acceptedMovements['d'] = acceptedMovements['ArrowRight']
      const keyPressed = command.keyPressed
      const player = state.players[command.playerId]

      if(state.gameOver || state.win){
         return
      }
      if(player.invulnerable > 0){
         player.invulnerable--
      }
      if(player.stun > 0){
         player.stun--
         return
      }

      const moveFunction = acceptedMovements[keyPressed]

      if(moveFunction){
         moveFunction(player)
      }
     
   }

   function canMove(dx, dy, player){
      const posFutureX = player.x + dx
      const posFutureY = player.y + dy
      if(posFutureX < 0 || posFutureY < 0 || posFutureX >= state.screen.width || posFutureY >= state.screen.height){
         return false
      }
      return wall(dx,dy,player)
         && box(dx,dy,player)
         && win(dx,dy,player)
         && coin(dx,dy,player)
         && key(dx,dy,player)
         && tp(dx,dy,player)
         && door(dx,dy,player)
         && keydoor(dx,dy,player)
         && plate(dx,dy,player)
         && spike(dx,dy,player)
         && pit(dx,dy,player)
         && snare(dx,dy,player)
         && dart(dx,dy,player)
         && bomb(dx,dy,player)
         && ice(dx,dy,player)
   }

   function loseLife(player){
      if(player.invulnerable > 0) return false
      player.lives--
      player.invulnerable = 2
      if(player.lives <= 0){
         if(state.mode === 'single'){
            state.gameOver = true
            return true
         }
         player.lives = 3
         const spawn = state.spawn || { x: 12, y: 0 }
         player.x = spawn.x
         player.y = spawn.y
         return true
      }
      return false
   }

   function spike(dx, dy, player){
      const posFutureX = player.x + dx
      const posFutureY = player.y + dy
      for(const spikeId in state.spikes){
         const spike = state.spikes[spikeId]
         if(posFutureX === spike.x && posFutureY === spike.y){
            if(loseLife(player)) return false
         }
      }
      return true
   }

   function pit(dx, dy, player){
      const posFutureX = player.x + dx
      const posFutureY = player.y + dy
      for(const pitId in state.pits){
         const pit = state.pits[pitId]
         if(posFutureX === pit.x && posFutureY === pit.y){
            const spawn = state.spawn || { x: 12, y: 0 }
            player.x = spawn.x
            player.y = spawn.y
            return false
         }
      }
      return true
   }

   function snare(dx, dy, player){
      const posFutureX = player.x + dx
      const posFutureY = player.y + dy
      for(const snareId in state.snares){
         const snare = state.snares[snareId]
         if(posFutureX === snare.x && posFutureY === snare.y){
            player.stun = 3
            delete state.snares[snareId]
            const playerId = findPlayerId(player)
            if(playerId) delete state.slides[playerId]
         }
      }
      return true
   }

   const DART_DIRECTIONS = {
      ArrowUp: { dx: 0, dy: -1 },
      ArrowRight: { dx: 1, dy: 0 },
      ArrowDown: { dx: 0, dy: 1 },
      ArrowLeft: { dx: -1, dy: 0 },
   }

   function dart(dx, dy, player){
      return true
   }

   function bomb(dx, dy, player){
      const posFutureX = player.x + dx
      const posFutureY = player.y + dy
      for(const bombId in state.bombs){
         const bomb = state.bombs[bombId]
         if(posFutureX === bomb.x && posFutureY === bomb.y){
            explodeBomb(bombId)
            return false
         }
      }
      return true
   }

   function explodeBomb(bombId){
      const bomb = state.bombs[bombId]
      if(!bomb) return
      delete state.bombs[bombId]
      const radius = typeof bomb.radius === 'number' ? bomb.radius : 3
      for(const playerId in state.players){
         if(state.players[playerId].x === bomb.x && state.players[playerId].y === bomb.y){
            loseLife(state.players[playerId])
         }
      }
      for(const boxId in state.boxes){
         if(state.boxes[boxId].x === bomb.x && state.boxes[boxId].y === bomb.y){
            delete state.boxes[boxId]
         }
      }
      state.shockwaves[shockwaveIdCounter++] = {
         x: bomb.x,
         y: bomb.y,
         maxRadius: radius,
         cells: { [bomb.x + ',' + bomb.y]: true },
         hitPlayers: {}
      }
   }

   function hasWall(x, y){
      for(const wallId in state.walls){
         if(state.walls[wallId].x === x && state.walls[wallId].y === y) return true
      }
      return false
   }

   function hitPlayer(x, y){
      for(const playerId in state.players){
         const player = state.players[playerId]
         if(player.x === x && player.y === y){
            loseLife(player)
            return true
         }
      }
      return false
   }

   function isBlocked(x, y){
      if(x < 0 || y < 0 || x >= state.screen.width || y >= state.screen.height) return true
      for(const wallId in state.walls){
         const wall = state.walls[wallId]
         if(wall.x === x && wall.y === y) return true
      }
      for(const boxId in state.boxes){
         const box = state.boxes[boxId]
         if(box.x === x && box.y === y) return true
      }
      for(const doorId in state.door){
         const door = state.door[doorId]
         if(door.x === x && door.y === y) return true
      }
      for(const keydoorId in state.keydoor){
         const keydoor = state.keydoor[keydoorId]
         if(keydoor.x === x && keydoor.y === y) return true
      }
      return false
   }

   function tick(){
      for(const dartId in state.darts){
         const dart = state.darts[dartId]
         const dir = DART_DIRECTIONS[dart.direction]
         if(!dir) continue
         const configured = dart.cooldown === undefined ? DART_DEFAULT_COOLDOWN : dart.cooldown
         let resetTo
         if(configured <= 0){
            resetTo = DART_DEFAULT_COOLDOWN
         } else {
            if(dart.base === undefined) dart.base = configured
            const cooldown = dart.cooldown - 1
            if(cooldown > 0){
               dart.cooldown = cooldown
               continue
            }
            resetTo = dart.base
         }
         dart.cooldown = resetTo
         state.projectiles[projectileIdCounter++] = {
            x: dart.x,
            y: dart.y,
            direction: dart.direction,
            distance: 0,
            range: dart.range,
            speed: dart.speed === undefined ? 2 : dart.speed,
            timer: 0,
         }
      }

      for(const projectileId in state.projectiles){
         const projectile = state.projectiles[projectileId]
         const dir = DART_DIRECTIONS[projectile.direction]
         if(!dir){
            delete state.projectiles[projectileId]
            continue
         }
         projectile.timer++
         if(projectile.timer < projectile.speed){
            continue
         }
         projectile.timer = 0
         projectile.x += dir.dx
         projectile.y += dir.dy
         projectile.distance++
         if(hitPlayer(projectile.x, projectile.y) || isBlocked(projectile.x, projectile.y) || projectile.distance > projectile.range){
            delete state.projectiles[projectileId]
         }
      }

      for(const shockwaveId in state.shockwaves){
         const shockwave = state.shockwaves[shockwaveId]
         const growth = {}
         for(const key in shockwave.cells){
            const comma = key.indexOf(',')
            const cx = +key.slice(0, comma)
            const cy = +key.slice(comma + 1)
            const neighbors = [cx + 1, cy, cx - 1, cy, cx, cy + 1, cx, cy - 1]
            for(let i = 0; i < 8; i += 2){
               const nx = neighbors[i]
               const ny = neighbors[i + 1]
               if(nx < 0 || ny < 0 || nx >= state.screen.width || ny >= state.screen.height) continue
               if(Math.abs(nx - shockwave.x) + Math.abs(ny - shockwave.y) > shockwave.maxRadius) continue
               if(hasWall(nx, ny)) continue
               const nkey = nx + ',' + ny
               if(shockwave.cells[nkey] || growth[nkey]) continue
               growth[nkey] = true
            }
         }
         if(Object.keys(growth).length === 0){
            delete state.shockwaves[shockwaveId]
            continue
         }
         for(const nkey in growth){
            const comma = nkey.indexOf(',')
            const nx = +nkey.slice(0, comma)
            const ny = +nkey.slice(comma + 1)
            shockwave.cells[nkey] = true
            for(const playerId in state.players){
               if(shockwave.hitPlayers[playerId]) continue
               if(state.players[playerId].x === nx && state.players[playerId].y === ny){
                  loseLife(state.players[playerId])
                  shockwave.hitPlayers[playerId] = true
               }
            }
            for(const boxId in state.boxes){
               if(state.boxes[boxId].x === nx && state.boxes[boxId].y === ny){
                  delete state.boxes[boxId]
               }
            }
         }
      }

      for(const playerId in state.slides){
         const player = state.players[playerId]
         if(!player){
            delete state.slides[playerId]
            continue
         }
         const slide = state.slides[playerId]
         if(!isIce(player.x, player.y)){
            if(slide.leaving){
               delete state.slides[playerId]
               continue
            }
            slide.leaving = true
         }
         if(!canMove(slide.dx, slide.dy, player)){
            delete state.slides[playerId]
            continue
         }
         player.x += slide.dx
         player.y += slide.dy
      }

      for(const boxId in state.boxSlides){
         const box = state.boxes[boxId]
         if(!box){
            delete state.boxSlides[boxId]
            continue
         }
         const slide = state.boxSlides[boxId]
         if(!isIce(box.x, box.y)){
            if(slide.leaving){
               delete state.boxSlides[boxId]
               continue
            }
            slide.leaving = true
         }
         const nextX = box.x + slide.dx
         const nextY = box.y + slide.dy
         if(isPit(nextX, nextY)){
            fillPit(nextX, nextY)
            delete state.boxes[boxId]
            delete state.boxSlides[boxId]
            continue
         }
         if(!canMoveTo(nextX, nextY, boxId)){
            delete state.boxSlides[boxId]
            continue
         }
         box.x = nextX
         box.y = nextY
      }

      notifyAll({ type: 'tick' })
   }

   function ice(dx, dy, player){
      return true
   }

   function isIce(x, y){
      for(const iceId in state.ice){
         const iceTile = state.ice[iceId]
         if(x === iceTile.x && y === iceTile.y) return true
      }
      return false
   }

   function isPit(x, y){
      for(const pitId in state.pits){
         const pit = state.pits[pitId]
         if(x === pit.x && y === pit.y) return true
      }
      return false
   }

   function fillPit(x, y){
      for(const pitId in state.pits){
         const pit = state.pits[pitId]
         if(x === pit.x && y === pit.y){
            delete state.pits[pitId]
            return true
         }
      }
      return false
   }

   function beginSlide(dx, dy, player){
      const playerId = findPlayerId(player)
      if(!playerId) return
      if(isIce(player.x, player.y)){
         state.slides[playerId] = { dx, dy }
      } else {
         delete state.slides[playerId]
      }
   }
   
   function wall(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let NumWall in state.walls){
         let wall = state.walls[NumWall]
         if(posFutureX == wall.x && posFutureY == wall.y){ 
            result = false
         } else{}}
      return result
   }
   function canMoveTo(x, y, boxId){
      if(x < 0 || y < 0 || x >= state.screen.width || y >= state.screen.height){
         return false
      }
      for(const wallId in state.walls){
         const wall = state.walls[wallId]
         if(x == wall.x && y == wall.y) return false
      }
      for(const doorId in state.door){
         const door = state.door[doorId]
         if(x == door.x && y == door.y) return false
      }
      for(const keydoorId in state.keydoor){
         const keydoor = state.keydoor[keydoorId]
         if(x == keydoor.x && y == keydoor.y) return false
      }
      for(const numBoxId in state.boxes){
         if(numBoxId == boxId) continue
         const box = state.boxes[numBoxId]
         if(x == box.x && y == box.y) return false
      }
      return true
   }
   function box(commandX, commandY, player){
      const posFutureX = player.x + commandX
      const posFutureY = player.y + commandY
      for(const boxId in state.boxes){
         const box = state.boxes[boxId]
         if(posFutureX == box.x && posFutureY == box.y){
            const boxFutureX = posFutureX + commandX
            const boxFutureY = posFutureY + commandY
            if(isPit(boxFutureX, boxFutureY)){
               fillPit(boxFutureX, boxFutureY)
               delete state.boxes[boxId]
               delete state.boxSlides[boxId]
               return true
            }
            if(canMoveTo(boxFutureX, boxFutureY, boxId)){
               box.x = boxFutureX
               box.y = boxFutureY
               if(isIce(box.x, box.y)){
                  state.boxSlides[boxId] = { dx: commandX, dy: commandY }
               } else {
                  delete state.boxSlides[boxId]
               }
               return true
            }
            return false
         }
      }
      return true
   }
   function win(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let NumWin in state.destiny){
         let win = state.destiny[NumWin]
         if(posFutureX == win.x && posFutureY == win.y){
            state.win = true
         }
      }
      return result
   }
   function coin(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let coinNUm in state.coins){
         let coin = state.coins[coinNUm]
         if(posFutureX == coin.x && posFutureY == coin.y){ 
            player.pontos ++
            coin.x = -1
            coin.y = -1
         } else{}}
      return result
   }
   function findPlayerId(player){
      for(const playerId in state.players){
         if(state.players[playerId] === player) return playerId
      }
      return null
   }
   function key(commandX, commandY, player){
      const posFutureX = player.x + commandX
      const posFutureY = player.y + commandY
      for(const keyId in state.keys){
         const key = state.keys[keyId]
         if(posFutureX == key.x && posFutureY == key.y){
            const playerId = findPlayerId(player)
            if(playerId){
               state.inventory[playerId] = (state.inventory[playerId] || 0) + 1
            }
            key.x = -1
            key.y = -1
         }}
      return true
   }
   function keydoor(commandX, commandY, player){
      const posFutureX = player.x + commandX
      const posFutureY = player.y + commandY
      for(const keydoorId in state.keydoor){
         const keydoor = state.keydoor[keydoorId]
         if(posFutureX == keydoor.x && posFutureY == keydoor.y){
            const playerId = findPlayerId(player)
            if(playerId && (state.inventory[playerId] || 0) > 0){
               state.inventory[playerId] -= 1
               delete state.keydoor[keydoorId]
               return true
            }
            return false
         }}
      return true
   }
   function tp(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true

      for(let tpId in state.tp){
         let tp = state.tp[tpId]
         if(posFutureX == tp.x && posFutureY == tp.y){ 
            player.x = tp.destino.x
            player.y = tp.destino.y
            result = false
         } else{}}
      return result
   }
   function door(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let NumDoor in state.door){
         let door = state.door[NumDoor]
         if(posFutureX == door.x && posFutureY == door.y){ 
            result = false
         } else{}}
      return result
   }
   function findDoorId(doorRef){
      if(typeof doorRef === 'string'){
         return doorRef in state.door ? doorRef : null
      }
      if(doorRef && typeof doorRef.x === 'number' && typeof doorRef.y === 'number'){
         for(const doorId in state.door){
            const door = state.door[doorId]
            if(door.x === doorRef.x && door.y === doorRef.y){
               return doorId
            }
         }
      }
      return null
   }
   function plate(commandX, commandY, player){
      const playerPos = player
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      
      for(const plateId in state.plate){
         const plate = state.plate[plateId]
         if(posFutureX == plate.x && posFutureY == plate.y){ 
            const doorId = findDoorId(plate.door)
            if(doorId !== null){
               delete state.door[doorId]
            }
            for(const bombId in state.bombs){
               const bomb = state.bombs[bombId]
               if(bomb.plate === plateId){
                  explodeBomb(bombId)
               }
            }
            delete state.plate[plateId]
         }}
      return true
   }





   return {
      movePlayer,
      addPlayer,
      removePlayer,
      movePlayer,
      subscribe,
      state,
      setState,
      tick,
   }
  
}
