import { type Position, type Player, type Direction } from './player'
import { getRandomPosition } from './utils'
import { clients } from './servers/websockets'

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

  changePlayerDirection (id: string, direction: Direction) {
    const player = this.players.get(id)
    if (player === undefined) return
    player.direction = direction
  }

  private update () {

  }

  private hasCollisioned (player: Player) {
    return this.collisionedAgainstPlayers(player) || this.collisionedAgainstWalls([player.position, ...player.body])
  }

  private collisionedAgainstPlayers (player: Player) {
    return [...this.players.values()].some(somePlayer => {
      if (somePlayer === player) {
        return this.collisionedAgainstItself(player)
      }
      return this.collisionedAgainstOtherPlayers(player, somePlayer)
    })
  }

  private collisionedAgainstItself (player: Player) {
    for (let i = 0; i < player.body.length; i++) {
      if (player.position.x === player.body[i].x && player.position.y === player.body[i].y) return true
    }
    return false
  }

  private collisionedAgainstOtherPlayers (player: Player, somePlayer: Player) {
    if (somePlayer.position.x === player.position.x && somePlayer.position.y === player.position.y) return true
    for (let i = 0; i < somePlayer.body.length; i++) {
      if (player.position.x === somePlayer.body[i].x && player.position.y === somePlayer.body[i].y) return true
    }
    return false
  }

  private collisionedAgainstWalls (parts: Position[]) {
    return parts.some(({ x, y }) => {
      return x < 0 || x >= this.mapSize ||
             y < 0 || y >= this.mapSize
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

interface Information {
  apple: Position
  players: Player[]
}
