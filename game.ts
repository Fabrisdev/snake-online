import { type Player } from './player'

export class Game {
  private readonly mapSize: number
  private readonly playerSize: number
  private readonly host: Player
  private readonly players: Map<string, Player>

  constructor (host: Player, mapSize?: number, playerSize?: number) {
    this.host = host
    this.players = new Map()
    this.mapSize = mapSize ?? 500
    this.playerSize = playerSize ?? 25
  }

  addPlayer (id: string, player: Player) {
    this.players.set(id, player)
  }

  removePlayer (id: string) {
    this.players.delete(id)
  }
}
