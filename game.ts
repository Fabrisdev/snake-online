import type Player from './player'
import { type Position, type Direction } from './player'
import { getRandomPosition } from './utils'
import { clients } from './servers/websockets'

interface Options {
  ticksPerSecond?: number
  mapSize?: number
}

interface Information {
  apple: Position
  players: Player[]
}

export default class Game {
  private readonly ticksPerSecond: number
  private readonly mapSize: number
  private readonly host: Player
  private readonly players = new Map<string, Player>()
  private apple: Position

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

  changePlayerDirection (id: string, direction: Direction) {
    const player = this.players.get(id)
    if (player === undefined) return
    player.direction = direction
  }

  private update () {
    this.players.forEach((player, key) => {
      player.move()
      if (hasCollisioned(player, [...this.players.values()], this.mapSize)) {
        this.removePlayer(key)
        return
      }
      if (player.position.x === this.apple.x && player.position.y === this.apple.y) {
        this.apple = getRandomPosition(0, this.mapSize)
        grow(player)
      }
    })
    this.sendInformationToPlayers({
      apple: this.apple,
      players: [...this.players.values()]
    })
  }

  private sendInformationToPlayers (information: Information) {
    [...this.players.keys()].forEach(id => {
      const client = clients.get(id)
      if (client === undefined) return
      client.send(JSON.stringify(information))
    })
  }
}
