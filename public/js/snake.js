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
    super.draw()
    this.#drawName(this.#name, {
      x: super.getPosition().x * super.getSize() + super.getSize() / 2, 
      y: super.getPosition().y * super.getSize() - 5
    })
  }

  #drawName(name, position) {
    this.drawText(name, position)
  }
}