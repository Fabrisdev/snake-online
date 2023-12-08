import { type Player } from './player'

export class Game {
  private readonly host: Player
  private readonly players: Player[]

  constructor (host: Player) {
    this.host = host
  }

  addPlayer (player: Player) {

  }
}
