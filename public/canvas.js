const options = {
  size: 500,
  playerSize: 25,
  deltatime: 200
}

handleCanvas(options)

function handleCanvas(options){
  const canvas = prepare(options.size)
  const ctx = mutateContext(canvas, options.playerSize)
  setInterval(() => {
    draw(ctx, options)
  }, options.deltatime)
}

function prepare(size) {
  const canvas = document.getElementById('game')
  if (canvas === null) throw "Canvas element not found"
  canvas.width = size
  canvas.height = size
  return canvas
}

function mutateContext(canvas, playerSize){
  const ctx = canvas.getContext("2d")
  ctx.drawSquare = (x, y) => {
    ctx.fillRect(x * playerSize, y * playerSize, playerSize, playerSize)
  }
  return ctx
}

function drawBackground(ctx, { size, playerSize }){
  for(let x = 0; x < size / playerSize; x++){
    let currentColor = "#aada54"
    for(let y = 0; y < size / playerSize; y++){
      if(x !== 0 && y === 0) currentColor = x % 2 !== 0 ? "#a2d34c" : "#aada54"
      ctx.fillStyle = currentColor
      currentColor = currentColor === "#aada54" ? "#a2d34c" : "#aada54"
      ctx.drawSquare(x, y)
    }
  }
}

const position = {
  NONE: Symbol(),
  RIGHT: Symbol(),
  LEFT: Symbol(),
  UP: Symbol(),
  DOWN: Symbol()
}

const player = {
  position: {
    x: 0,
    y: 0
  },
  direction: position.NONE
}
function draw(ctx, options) {
  drawBackground(ctx, options)
  ctx.fillStyle = "#000"
  ctx.drawSquare(player.position.x, player.position.y)
  document.addEventListener('keydown', event => {
    if(event.key === "w") player.direction = position.UP
    if(event.key === "d") player.direction = position.RIGHT
    if(event.key === "a") player.direction = position.LEFT
    if(event.key === "s") player.direction = position.DOWN
  })
  if(player.direction === position.RIGHT) player.position.x += 1
  if(player.direction === position.LEFT) player.position.x -= 1
  if(player.direction === position.UP) player.position.y -= 1
  if(player.direction === position.DOWN) player.position.y += 1
}