import type Player from './player'
import { type Position, type Direction } from './player'
import { clients } from './servers/websockets'
import Apple from './apple'

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
  private apple

  constructor (host: Player, options: Options) {
    this.host = host
    this.mapSize = options.mapSize ?? 10
    this.apple = new Apple(this.mapSize)
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
    this.players.get(id)?.setDirection(direction)
  }

  private update () {
    this.players.forEach((player, key) => {
      player.move()
      if (player.collisioned([...this.players.values()], this.mapSize)) {
        this.removePlayer(key)
        return
      }
      if (player.hasAteApple(this.apple)) {
        this.apple = new Apple(this.mapSize)
        player.grow()
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
