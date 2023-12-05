import Painter from "./painter.js"

export default class Player extends Painter {
  #name
  #position
  #body
  #size
  #color

  constructor({ 
    ctx, position, body, size, color, name
  }) {
    super(ctx)
    this.#position = position
    this.#body = body
    this.#size = size
    this.#color = color
    this.#name = name
  }
  
  draw() {
    this.#drawName(this.#name, {
      x: this.#position.x * this.#size + this.#size / 2, 
      y: this.#position.y * this.#size - 5
    })
  }

  #drawName(name, position) {
    this.drawText(name, position)
  }
}