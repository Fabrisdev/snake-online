export default class Painter {
  #ctx

  constructor(ctx) {
    this.#ctx = ctx
  }

  drawText(text, position) {
    this.#ctx.font = "20px sans-serif"
    this.#ctx.textAlign = "center"
    this.#ctx.fillText(text, position.x, position.y)
  }

  drawSquare(position, size, color) {
    this.#ctx.fillStyle = color
    this.#ctx.fillRect(position.x * size, position.y * size, size, size)
  }
}