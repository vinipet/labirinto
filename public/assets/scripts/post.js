
const $createServerModal = document.getElementById('create-room-modal')
const $joinServerModal = document.getElementById('join-room-modal')
const $closeModalBtn = document.getElementsByClassName('close')


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


const $form = document.getElementById('Criar')
$form.addEventListener('submit', (event)=>{
      event.preventDefault()
      const data = new FormData($form)
      console.log(data)
      fetch("/create",{
            method:'POST',
            body: data,
      })
      .then(async (res) => {
            const status = await res.text();
            console.log(res);
            if (status === 'connected') {
                location.href = '/play';
            } else {
                alert(JSON.stringify(res));
            }
        })
        .catch((error) => {
            console.error('Erro ao enviar requisição:', error);
        });
}) 

