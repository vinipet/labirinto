export default function createGame(){
   let pontos = 0
   let ponto = document.getElementById('')
   const state = {
      screen:{width:25, height:25},
      players: {
         'player1': {x:0, y:0}
      },
      walls: {

         'wall1': {x:0, y:1,},
         'wall2': {x:13, y:0,},
         'wall3': {x:14, y:0,},
         'wall4': {x:15, y:0,},
         'wall5': {x:16, y:0,},
         'wall6': {x:17, y:0,},
         'wall7': {x:0, y:1,},
         'wall8': {x:1, y:1,},
         'wall9': {x:2, y:1,},
         'wall10':{x:3, y:1,},
         'wall11':{x:4, y:1,},
         'wall12':{x:5, y:1,},
         'wall13':{x:6, y:1,},
         'wall14':{x:7, y:1,},
         'wall15':{x:8, y:1,},
         'wall16':{x:9, y:1,},
         'wall17':{x:10, y:1,},
         'wall18':{x:11, y:1,},
         'wall19':{x:14, y:1,},
         'wall20':{x:15, y:1,},
         'wall21':{x:16, y:1,},
         'wall22':{x:17, y:1,},
         'wall23':{x:19, y:1,},
         'wall24':{x:20, y:1,},
         'wall25':{x:21, y:1,},
         'wall26':{x:22, y:1,},
         'wall27':{x:23, y:1,},
         'wall28':{x:24, y:1,},
         'wall29':{x:0, y:2,},
         'wall30':{x:1, y:2,},
         'wall31':{x:2, y:2,},
         'wall32':{x:3, y:2,},
         'wall33':{x:4, y:2,},
         'wall34':{x:5, y:2,},
         'wall35':{x:6, y:2,},
         'wall36':{x:7, y:2,},
         'wall37':{x:8, y:2,},
         'wall38':{x:9, y:2,},
         'wall39':{x:10, y:2,},
         'wall40':{x:11, y:2,},
         'wall41':{x:12, y:2,},
         'wall42':{x:15, y:2,},
         'wall43':{x:16, y:2,},
         'wall44':{x:17, y:2,},
         'wall45':{x:19, y:2,},
         'wall46':{x:20, y:2,},
         'wall47':{x:21, y:2,},
         'wall48':{x:22, y:2,},
         'wall49':{x:23, y:2,},
         'wall50':{x:24, y:2,},
         'wall51':{x:0, y:3,},
         'wall52':{x:1, y:3,},
         'wall53':{x:2, y:3,},
         'wall54':{x:3, y:3,},
         'wall55':{x:4, y:3,},
         'wall56':{x:5, y:3,},
         'wall57':{x:6, y:3,},
         'wall58':{x:7, y:3,},
         'wall59':{x:8, y:3,},
         'wall60':{x:9, y:3,},
         'wall61':{x:10, y:3,},
         'wall62':{x:11, y:3,},
         'wall63':{x:12, y:3,},
         'wall64':{x:13, y:3,},
         'wall65':{x:22, y:3,},
         'wall66':{x:23, y:3,},
         'wall67':{x:16, y:3,},
         'wall68':{x:17, y:3,},
         'wall69':{x:11, y:4,},
         'wall70':{x:19, y:3,},
         'wall71':{x:20, y:3,},
         'wall72':{x:21, y:3,},
         'wall73':{x:12, y:4,},
         'wall74':{x:13, y:4,},
         'wall75':{x:14, y:4,},
         'wall76':{x:17, y:4,},
         'wall77':{x:24, y:3,},
         'wall78':{x:18, y:4,},
         'wall79':{x:19, y:4,},
         'wall80':{x:20, y:4,},
         'wall81':{x:21, y:4,},
         'wall82':{x:21, y:4,},
         'wall83':{x:22, y:4,},
         'wall84':{x:23, y:4,},
         'wall85':{x:24, y:4,},
         'wall86':{x:15, y:5},
         'wall87':{x:18, y:5},
         'wall88':{x:22, y:5},
         'wall89':{x:23, y:5},
         'wall90':{x:24, y:5},
         'wall91':{x:24, y:6},
         'wall92':{x:24, y:7},
         'wall93':{x:23, y:7},
         'wall94':{x:23, y:6},
         'wall95':{x:22, y:6},
         'wall96':{x:22, y:7}, 
         'wall97':{x:20, y:7},
'wall98':{x:20, y:7},
'wall99':{x:20, y:8},
'wall100':{x:20, y:9},
'wall101':{x:20, y:10},
'wall102':{x:21, y:10},
'wall103':{x:22, y:10},
'wall104':{x:23, y:10},
'wall105':{x:23, y:11},
'wall106':{x:23, y:12},
'wall107':{x:23, y:13},
'wall108':{x:23, y:14},
'wall109':{x:23, y:15},
'wall110':{x:23, y:16},
'wall111':{x:23, y:17},
'wall112':{x:23, y:18},
'wall113':{x:23, y:19},
'wall114':{x:23, y:20},
'wall115':{x:23, y:21},
'wall116':{x:23, y:22},
'wall117':{x:23, y:23},
'wall118':{x:23, y:24},
'wall119':{x:22, y:24},
'wall120':{x:21, y:24},
'wall121':{x:20, y:24},
'wall122':{x:19, y:24},
'wall123':{x:18, y:24},
'wall124':{x:17, y:24},
'wall125':{x:16, y:24},
'wall126':{x:15, y:24},
'wall127':{x:14, y:24},
'wall128':{x:13, y:24},
'wall129':{x:12, y:24},
'wall130':{x:11, y:24},
'wall131':{x:10, y:24},
'wall132':{x:9, y:24},
'wall133':{x:8, y:24},
'wall134':{x:7, y:24},
'wall135':{x:6, y:24},
'wall136':{x:5, y:24},
'wall137':{x:4, y:24},
'wall138':{x:3, y:24},
'wall139':{x:2, y:24},
'wall140':{x:1, y:24},
'wall141':{x:0, y:24},
'wall142':{x:2, y:14},
'wall143':{x:1, y:22},
'wall144':{x:1, y:21},
'wall145':{x:1, y:20},
'wall146':{x:1, y:19},
'wall147':{x:1, y:18},
'wall148':{x:1, y:17},
'wall149':{x:1, y:16},
'wall150':{x:1, y:15},
'wall151':{x:1, y:14},
'wall152':{x:1, y:13},
'wall153':{x:1, y:12},
'wall154':{x:1, y:11},
'wall155':{x:1, y:10},
'wall156':{x:1, y:9},
'wall157':{x:1, y:8},
'wall158':{x:1, y:7},
'wall159':{x:1, y:6},
'wall160':{x:1, y:5},
'wall161':{x:1, y:5},  
'wall162':{x:2, y:5},
'wall163':{x:3, y:5},
'wall164':{x:4, y:5},
'wall165':{x:5, y:5},
'wall166':{x:6, y:5},
'wall167':{x:7, y:5},
'wall168':{x:8, y:5},
'wall169':{x:9, y:5},
'wall170':{x:11, y:6},
'wall171':{x:12, y:6},
'wall172':{x:13, y:6},
'wall173':{x:16, y:6},
'wall174':{x:18, y:6},
'wall175':{x:20, y:6},
'wall176':{x:4, y:7},
'wall177':{x:5, y:7},
'wall178':{x:6, y:7},
'wall179':{x:8, y:7},
'wall180':{x:9, y:7},
'wall181':{x:10, y:7},
'wall182':{x:16, y:7},
'wall183':{x:18, y:7},
'wall184':{x:4, y:8},
'wall185':{x:10, y:8},
'wall186':{x:12, y:8},
'wall187':{x:13, y:8},
'wall188':{x:14, y:8},
'wall189':{x:15, y:8},
'wall190':{x:16, y:8},
'wall191':{x:18, y:8},
'wall192':{x:22, y:8},
'wall193':{x:23, y:8},
'wall194':{x:24, y:8},
'wall195':{x:4, y:9},
'wall196':{x:4, y:10},
'wall197':{x:4, y:11},
'wall198':{x:4, y:12},
'wall199':{x:5, y:12},
'wall200':{x:6, y:12},
'wall201':{x:7, y:12},
'wall202':{x:8, y:12},
'wall203':{x:9, y:12},
'wall204':{x:10, y:12},
'wall205':{x:11, y:12},
'wall206':{x:12, y:12},
'wall207':{x:13, y:12},
'wall208':{x:15, y:12},
'wall209':{x:19, y:12},
'wall210':{x:19, y:13},
'wall211':{x:19, y:14},
'wall212':{x:19, y:15},
'wall213':{x:19, y:16},
'wall214':{x:10, y:10},
'wall215':{x:10, y:11},
'wall216':{x:10, y:9},
'wall217':{x:11, y:10},
'wall218':{x:12, y:10},
'wall219':{x:13, y:10},
'wall220':{x:14, y:10},
'wall221':{x:15, y:10},
'wall222':{x:15, y:11},
'wall223':{x:16, y:10},
'wall224':{x:17, y:10},
'wall225':{x:18, y:10},
'wall226':{x:18, y:9},
'wall227':{x:2, y:15},
'wall228':{x:2, y:16},
'wall229':{x:2, y:17},
'wall230':{x:2, y:18},
'wall231':{x:2, y:19},
'wall232':{x:2, y:20},
'wall233':{x:2, y:21},
'wall234':{x:2, y:22},
'wall235':{x:3, y:22},
'wall236':{x:3, y:21},
'wall237':{x:3, y:20},
'wall238':{x:3, y:19},
'wall239':{x:3, y:18},
'wall240':{x:3, y:17},
'wall241':{x:3, y:16},
'wall242':{x:3, y:15},
'wall243':{x:3, y:14},
'wall244':{x:4, y:14},
'wall245':{x:5, y:14},
'wall246':{x:6, y:14},
'wall247':{x:7, y:14},
'wall248':{x:8, y:14},
'wall249':{x:9, y:14},
'wall250':{x:10, y:14},
'wall251':{x:11, y:14},
'wall252':{x:12, y:14},
'wall253':{x:15, y:14},
'wall254':{x:15, y:13},
'wall255':{x:15, y:14},
'wall256':{x:15, y:15},
'wall257':{x:15, y:16},
'wall258':{x:15, y:17},
'wall259':{x:15, y:18},
'wall260':{x:15, y:19},
'wall261':{x:15, y:20},
'wall262':{x:15, y:21},
'wall263':{x:15, y:22},
'wall264':{x:15, y:23},
'wall265':{x:12, y:23},
'wall266':{x:12, y:22},
'wall267':{x:12, y:21},
'wall268':{x:12, y:20},
'wall269':{x:12, y:19},
'wall270':{x:12, y:18},
'wall271':{x:12, y:17},
'wall272':{x:12, y:16},
'wall273':{x:12, y:15},
'wall274':{x:12, y:14},
'wall275':{x:12, y:13},
'wall276':{x:16, y:17},
'wall277':{x:17, y:17},
'wall278':{x:17, y:16},
'wall279':{x:21, y:16},
'wall280':{x:21, y:17},
'wall281':{x:22, y:17},
'wall282':{x:4, y:22},
'wall283':{x:5, y:22},
'wall284':{x:6, y:22},
'wall285':{x:7, y:22},
'wall286':{x:8, y:22},
'wall287':{x:9, y:22},
'wall288':{x:10, y:22},
'wall289':{x:11, y:22},
'wall290':{x:13, y:22},
'wall291':{x:14, y:22},
'wall292':{x:13, y:23},
'wall293':{x:14, y:23},
'wall294':{x:16, y:22},
'wall295':{x:16, y:23},
'wall296':{x:17, y:22},
'wall297':{x:17, y:23},
'wall298':{x:18, y:22},
'wall299':{x:18, y:23},
'wall300':{x:19, y:22},
'wall301':{x:19, y:23},
'wall302':{x:20, y:22},
'wall303':{x:20, y:23},
'wall304':{x:21, y:22},
'wall305':{x:21, y:23},
'wall306':{x:22, y:22},
'wall307':{x:22, y:23},

      },
      destiny: {
         '1': {x:24, y:24,},
      },
      coins: {
         '1': {x:18, y:3},
         '2': {x:11, y:23},
         '3': {x:18, y:20},
         '4': {x:19, y:20},
         '5': {x:20, y:20},
         '6': {x:18, y:21},
         '7': {x:19, y:21},
         '8': {x:20, y:21},
         '9':{x:5, y:16},
         '10':{x:5, y:17},
         '11':{x:5, y:18},
         '12':{x:5, y:19},
         '13':{x:5, y:20},
         '14':{x:6, y:16},
         '15':{x:6, y:17},
         '16':{x:6, y:18},
         '17':{x:6, y:19},
         '18':{x:6, y:20},
         '19':{x:7, y:16},
         '20':{x:7, y:17},
         '21':{x:7, y:18},
         '22':{x:7, y:19},
         '23':{x:7, y:20},
         '24':{x:8, y:16},
         '25':{x:8, y:17},
         '26':{x:8, y:18},
         '27':{x:8, y:19},
         '28':{x:8, y:20},
      },
      tp: {
         '1': {x:24, y:0},
         '2':{x:7, y:11},
         '3':{x:11, y:11},
         '4':{x:11, y:18},
         '5':{x:16, y:16},
         '6':{x:22, y:16},
         '7':{x:19, y:17},
         '8':{x:13, y:21},
      }
   }
   function movePlayer(command){

      const acceptedMovements = {
         ArrowUp(player){

            if(player.y-1 >=0 && wall(0,-1) && win(0,-1)&& coin(+1,0)){
               player.y = player.y-1
            }
         },
         ArrowRight(player){
            if(player.x+1<state.screen.width && wall(+1,0) && win(+1,0) && coin(+1,0)){
               player.x =player.x+1
            }
         },
         ArrowDown(player){
            if(player.y+1<state.screen.height && wall(0,+1) && win(0,+1)&& coin(+1,0)){
               player.y=player.y+1
            }
         },
         ArrowLeft(player){
            if(player.x-1>=0 && wall(-1,0) && win(-1,0)&& coin(+1,0)){
               player.x=player.x-1
            }
         },
         
         
      }
      const keyPressed = command.keyPressed
      const player = state.players[command.playerId]
      const moveFunction = acceptedMovements[keyPressed]

      if(moveFunction){
         moveFunction(player)
      }
     
   }
   
   return {
      movePlayer,
      state
   }
   
   function wall(commandX, commandY){
      const playerPos = state.players.player1
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
   function win(commandX, commandY){
      const playerPos = state.players.player1
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let NumWin in state.destiny){
         let win = state.destiny[NumWin]
         if(posFutureX == win.x && posFutureY == win.y){ 
            window.alert('vc ganhou')
         } else{}}
      return result
   }
   function coin(commandX, commandY){
      const playerPos = state.players.player1
      const posFutureX = playerPos.x + commandX
      const posFutureY = playerPos.y + commandY
      let result = true
      for(let coinNUm in state.coins){
         let coin = state.coins[coinNUm]
         if(posFutureX == coin.x && posFutureY == coin.y){ 
            pontos ++
            coin.x = -1
            coin.y = -1
         } else{}}
      return result
   }
}
