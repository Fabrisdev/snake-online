import { socket } from './ws.js'

let name = null
while(name === null){
  name = prompt('dame tu nombre gil')
}

const options = {
  size: 500,
  playerSize: 25,
  deltatime: 200
}

const canvas = prepare(options.size)
const ctx = mutateContext(options.playerSize)

function prepare(size) {
  const canvas = document.getElementById('game')
  if (canvas === null) throw "Canvas element not found"
  canvas.width = size
  canvas.height = size
  return canvas
}

function mutateContext(playerSize){
  const ctx = canvas.getContext("2d")
  ctx.drawSquare = (x, y) => {
    ctx.fillRect(x * playerSize, y * playerSize, playerSize, playerSize)
  }
  return ctx
}

function drawBackground(){
  for(let x = 0; x < options.size / options.playerSize; x++){
    let currentColor = "#aada54"
    for(let y = 0; y < options.size / options.playerSize; y++){
      if(x !== 0 && y === 0) currentColor = x % 2 !== 0 ? "#a2d34c" : "#aada54"
      ctx.fillStyle = currentColor
      currentColor = currentColor === "#aada54" ? "#a2d34c" : "#aada54"
      ctx.drawSquare(x, y)
    }
  }
}

const direction = {
  RIGHT: "right",
  LEFT: "left",
  UP: "up",
  DOWN: "down",
  STOPPED: "stopped"
}

export function draw(gameInfo) {
  drawBackground()
  drawApple(gameInfo.apple)
  drawPlayers(gameInfo.players)
}

function drawApple(applePosition){
  ctx.fillStyle = "#f00"
  ctx.drawSquare(applePosition.x, applePosition.y)
}

function drawPlayers(players){
  players.forEach(player => {
    ctx.fillStyle = player.color
    ctx.drawSquare(player.position.x, player.position.y)
    ctx.font = "20px sans-serif";
    ctx.textAlign = "center"
    ctx.fillText(player.name, player.position.x * options.playerSize + options.playerSize / 2, player.position.y * options.playerSize - 5);
  })
}

document.addEventListener('keyup', event => {
  if(event.key === "w") sendDirection(direction.UP)
  if(event.key === "d") sendDirection(direction.RIGHT)
  if(event.key === "a") sendDirection(direction.LEFT)
  if(event.key === "s") sendDirection(direction.DOWN)
  if(event.key === "f") sendDirection(direction.STOPPED)
})

function sendDirection(direction){
  socket.send(JSON.stringify({
    name,
    direction
  }))
}