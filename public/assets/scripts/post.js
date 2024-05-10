
const $createServerModal = document.getElementById('create-room-modal')
const $joinServerModal = document.getElementById('join-room-modal')
const $closeModalBtn = document.getElementsByClassName('close')


for (const element of $closeModalBtn) {
      console.log(element)
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


const $createRoomBTN = getElementById(Criar)
$createRoomBTN.addEventListener('click', (event)=>{
      event.preventDefault()
      createRoom()
}) 


function createRoom(){
      const name = getElementById('create-room-name').value
      const password = getElementById('create-room-password').value

      console.log(JSON.stringify({
            names: name,
            passwords: password
      }))
      
      fetch('/play',{
            method:'POST',
            body: JSON.stringify({
                  names: name,
                  passwords: password
            }),
            headers:{'content-type': 'application/json'}
      })
      .then(async(resp)=>{
            const status = await resp.text()
            console.log(status)
      })
}