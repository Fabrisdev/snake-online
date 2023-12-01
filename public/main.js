const form = document.getElementById('form-mensaje')

const socket = new WebSocket('ws://localhost:8080')

form.addEventListener('submit', event => {
  event.preventDefault()
  const data = Object.fromEntries(new FormData(form))
  socket.send(JSON.stringify(data))
})

socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
})
