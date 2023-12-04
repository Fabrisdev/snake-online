import { socket } from './ws.js'

const dialog = document.querySelector('dialog')
dialog.showModal()

const usernameSubmit = document.getElementById('username-submit')

class SnakeCanvas{
  #ctx
  #size
  #playerSize

  constructor(ctx, { size, playerSize }) {
    this.#ctx = ctx
    this.#playerSize = playerSize
    this.#size = size
  }

  drawPlayer = function(x, y, color) {
    this.#drawSquare(x, y, color)
  }

  drawApple = function(x, y) {
    this.#drawSquare(x, y, "#f00")
  }

  #drawSquare = function(x, y, color) {
    this.#ctx.fillStyle = color
    this.#ctx.fillRect(x * playerSize, y * playerSize, playerSize, playerSize)
  }

  drawBackground() {
    for(let x = 0; x < this.#size / this.#playerSize; x++){
      let currentColor = "#aada54"
      for(let y = 0; y < this.#size / this.#playerSize; y++){
        if(x !== 0 && y === 0) currentColor = x % 2 !== 0 ? "#a2d34c" : "#aada54"
        currentColor = currentColor === "#aada54" ? "#a2d34c" : "#aada54"
        this.#drawSquare(x, y, currentColor)
      }
    }
  }
}

class GameManager{
  #size = 500
  #playerSize = 25
  

}

function registerToPlay(){
  const usernameDialog = document.getElementById('username-dialog')
  const usernameInput = document.getElementById('username-input')
  if(usernameInput.value.length === 0 || usernameInput.value.length > 12) {
    const inputContainer = document.getElementById('input-container')
    inputContainer.style.backgroundColor = "#f00"
    inputContainer.style.animation = "error 500ms"
    setTimeout(() => {
      inputContainer.style.backgroundColor = "transparent"
      inputContainer.style.animation = ""
    }, 500)
    return
  }
  usernameDialog.close()
  document.addEventListener('keyup', event => {
    if(event.key === "w") sendDirection(usernameInput.value, direction.UP)
    if(event.key === "d") sendDirection(usernameInput.value, direction.RIGHT)
    if(event.key === "a") sendDirection(usernameInput.value, direction.LEFT)
    if(event.key === "s") sendDirection(usernameInput.value, direction.DOWN)
    if(event.key === "f") sendDirection(usernameInput.value, direction.STOPPED)
  })
}

usernameSubmit.addEventListener('click', () => {
  registerToPlay()
})

document.getElementById('username-dialog').addEventListener('keyup', event => {
  if(event.key !== "Enter") return
  registerToPlay()
})





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

const Direction = {
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

function sendDirection(name, direction){
  socket.send(JSON.stringify({
    name,
    direction
  }))
}