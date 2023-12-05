import Board from "./board.js"
import Apple from "./apple.js"
import Player from "./player.js"

export default class GameManager{
  #ctx
  #size
  #playerSize

  constructor(ctx, { size, playerSize }){
    this.#ctx = ctx
    this.#size = size
    this.#playerSize = playerSize
  }

  draw(data) {
    this.drawApple(data.apple)
    this.drawBackground()
    this.drawPlayers(data.players)
  }

  drawPlayers(players) {
    players.forEach(player => {
      new Player({
        ctx: this.#ctx,
        position: player.position,
        size: this.#playerSize,
        color: player.color,
        name: player.name,
      }).draw()
    })
  }

  drawApple(position) {
    new Apple({
      ctx: this.#ctx,
      position,
      size: this.#playerSize
    })
  }

  drawBackground() {
    new Board(this.#ctx, this.#size, this.#playerSize).draw()
  }
}