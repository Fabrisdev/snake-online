import GameManager from "./game-manager.js"

export const socket = new WebSocket('ws://localhost:8080')

const canvas = document.querySelector('canvas')
if(canvas === null) throw 'Canvas not found'
const size = 500
canvas.height = size
canvas.width = size

const game = new GameManager(canvas.getContext('2d'), {
  size,
  playerSize: 25
})

socket.addEventListener('message', (event) => {
  console.log('Message from server ', event.data)
  game.draw(JSON.parse(event.data))
})