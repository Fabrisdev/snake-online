import { draw } from "./canvas.js"

export const socket = new WebSocket('ws://localhost:8080')
export let clientId = null

socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
  const data = JSON.parse(event.data)
  if(data.clientId) return clientId = data.clientId 
  draw(data)
})


