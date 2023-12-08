import { type Position, type Player } from './player'
import { getRandomPosition } from './utils'

interface Options {
  ticksPerSecond?: number
  mapSize?: number
}

export default class Game {
  private readonly ticksPerSecond: number
  private readonly mapSize: number
  private readonly playerSize = 25
  private readonly host: Player
  private readonly players = new Map<string, Player>()
  private readonly apple: Position

  constructor (host: Player, options: Options) {
    this.host = host
    this.mapSize = options.mapSize ?? 10
    this.apple = getRandomPosition(0, this.mapSize)
    this.ticksPerSecond = options.ticksPerSecond ?? 5
    setInterval(this.update.bind(this), 1 / this.ticksPerSecond * 1000)
  }

  addPlayer (id: string, player: Player) {
    this.players.set(id, player)
  }

  removePlayer (id: string) {
    this.players.delete(id)
  }

  private update () {

  }
}
