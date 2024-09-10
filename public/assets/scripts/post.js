const $joinServerModal = document.getElementById('join-room-modal')
const $closeModalBtn = document.getElementsByClassName('close')
const $createServerModal = document.getElementById('create-room-modal')

for (const element of $closeModalBtn) {
      element.addEventListener('click', ()=>{
            $joinServerModal.close()   
            $createServerModal.close()
      })
}

const $createServerbtn = document.getElementById('new-server-btn').addEventListener('click',function (){
      $createServerModal.showModal()
})

const $joinServerbtn = document.getElementById('join-server-btn').addEventListener('click',function (){
      $joinServerModal.showModal()
})


const $createRoomForm = document.getElementById('Criar')
$createRoomForm.addEventListener('submit', (event)=>{
      event.preventDefault()
      const data = new FormData($createRoomForm)
      fetch("/create",{
            method:'POST',
            body: data,
      })
      .then(async (res) => {
            const status = await res.json();
            if (status.status === 'new room') {
                  console.log(status)
                  joinRoom({
                        name:status.name,
                        password:status.password
                  })
            } else {
                  
            }
        })
        .catch((error) => {
            console.error('Erro na requisição:', error);
            alert('Erro na requisição: ' + error.message);
        });
}) 


function joinRoom(body){
      fetch("/join", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
      }).then(async (res)=>{
            const status = await res.text()
            if(status == 'connected'){
                  loginRooom(body)
            }
      })
}

function loginRooom(name){
      fetch('/play',{
            method:'POST',
            body:name
      }).then(async (res)=>{  
            
      })
}
const $JoinRoomForm = document.getElementById('join')
$JoinRoomForm.addEventListener('submit', (event)=>{
      event.preventDefault()
      const data = new FormData($JoinRoomForm)
      joinRoom(data)
})
