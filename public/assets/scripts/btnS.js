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
