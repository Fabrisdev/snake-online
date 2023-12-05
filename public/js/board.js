import Painter from "./painter.js"

export default class Board extends Painter {
  #size
  #playerSize

  constructor(ctx, size, playerSize) {
    super(ctx)
    this.#playerSize = playerSize
    this.#size = size
  }

  draw() {
    for(let x = 0; x < this.#size / this.#playerSize; x++){
      let currentColor = "#aada54"
      for(let y = 0; y < this.#size / this.#playerSize; y++){
        if(x !== 0 && y === 0) currentColor = x % 2 !== 0 ? "#a2d34c" : "#aada54"
        currentColor = currentColor === "#aada54" ? "#a2d34c" : "#aada54"
        super.drawSquare({ x, y }, this.#playerSize, currentColor)
      }
    }
  }
}