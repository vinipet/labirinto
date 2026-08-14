
const mundo ={
   screen:{width:25, height:25},
   players: {
      'player1': {x:0, y:0}
   },
   walls: {
      '0': {x:22, y:8},
      '1': {x:25, y:5},
   },
   boxes: {
      '0': {x:3, y:5},
   },
   destiny: {
      '1': {x:24, y:24,},
   },
   coins: {

   },
   tp: {

   },
   spikes: {
      '0': {x:10, y:2},
      '1': {x:11, y:2},
   },
   ice: {
      '0': {x:13, y:2},
      '1': {x:14, y:2},
   },
   pits: {
      '0': {x:16, y:2},
   },
   snares: {
      '0': {x:18, y:2},
   },
   darts: {
      '0': {x:20, y:2, direction: 'ArrowRight', range: 3, speed: 2},
   },
   bombs: {
      '0': {x:22, y:5, radius: 3},
      '1': {x:12, y:8, radius: 3, plate: 'plate1'},
   },
   plate: {
      'plate1': {x:12, y:4},
   }
}

export default mundo
