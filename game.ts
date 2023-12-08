import { type Position, type Player } from './player'
import { getRandomPosition } from './utils'

export class Game {
  private readonly mapSize: number
  private readonly playerSize = 25
  private readonly host: Player
  private readonly players = new Map<string, Player>()
  private readonly apple: Position

  constructor (host: Player, mapSize?: number) {
    this.host = host
    this.mapSize = mapSize ?? 10
    this.apple = getRandomPosition(0, this.mapSize)
  }

  addPlayer (id: string, player: Player) {
    this.players.set(id, player)
  }

  removePlayer (id: string) {
    this.players.delete(id)
  }
}
