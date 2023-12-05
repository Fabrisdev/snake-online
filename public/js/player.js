import Square from "./square.js"

export default class Player extends Square {
  #name

  constructor({ 
    ctx, position, size, color, name
  }) {
    super({ 
      ctx, position, size, color
    })
    this.#name = name
  }
  
  draw() {
    super.draw()
    this.#drawName(this.#name, super.getPosition().x * super.getSize() + super.getSize() / 2, super.getPosition().y * super.getSize() - 5)
  }

  #drawName(name, position) {
    this.drawText(name, position)
  }
}