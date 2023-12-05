import Painter from "./painter.js"

export default class Square extends Painter{
  #size
  #position
  #color

  constructor({
    ctx, position, size, color
  }) {
    super(ctx)
    this.#size = size
    this.#position = position
    this.#color = color
  }

  draw() {
    this.drawSquare(this.#position, this.#size, this.#color)
  }

  getPosition() {
    return this.#position
  }

  getSize() {
    return this.#size
  }
}