import { type Player } from './player'

export class Game {
  private readonly host: Player
  private readonly players: Map<string, Player>

  constructor (host: Player) {
    this.host = host
    this.players = new Map()
  }

  addPlayer (id: string, player: Player) {
    this.players.set(id, player)
  }

  removePlayer (id: string) {
    this.players.delete(id)
  }
}
