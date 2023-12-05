export default class GameManager{
  #canvas
  
  constructor(canvas, { size, playerSize }){
    canvas.width = size
    canvas.height = size
    this.#canvas = new SnakeCanvas(canvas.getContext('2d'), { size, playerSize })
  }

  draw(data) {
    this.#canvas.drawBackground()
    this.#canvas.drawApple(gameInfo.apple)
    drawPlayers(gameInfo.players)
  }

  drawPlayers() {

  }
}