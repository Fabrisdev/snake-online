import { getRandomColor } from './utils'

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface PlayerData {
  name: string
  direction: Direction
}

export interface Position {
  x: number
  y: number
}

export interface PlayerA {
  name: string
  position: Position
  direction: Direction
  color: string
  body: Position[]
}

export function registerPlayer ({ clientId, players, playerData }: RegisterPlayer): void {
  players.set(clientId, {
    position: {
      x: 0,
      y: 0
    },
    color: getRandomColor(),
    ...playerData,
    body: []
  })
}

export default class Player {
  readonly name
  readonly color
  private readonly direction
  private readonly head: Position
  private readonly body: Position[] = []

  constructor (name: string, direction: Direction, color: string) {
    this.name = name
    this.color = color
    this.direction = direction
    this.head = { x: 0, y: 0 }
  }

  grow () {
    this.body.push(structuredClone(this.body.at(-1) ?? this.head))
  }

  move () {
    this.moveBody()
    this.moveHead()
  }

  private moveHead () {
    if (this.direction === 'up') this.head.y -= 1
    if (this.direction === 'down') this.head.y += 1
    if (this.direction === 'left') this.head.x -= 1
    if (this.direction === 'right') this.head.x += 1
  }

  private moveBody () {
    for (let i = this.body.length - 1; i >= 0; i--) {
      this.body[i] = structuredClone(this.body[i - 1]) ?? structuredClone(this.head)
    }
  }

  hasCollisioned (players: Player[], mapSize: number) {
    return this.collisionedAgainstPlayers(players) || this.collisionedAgainstWalls([this.head, ...this.body], mapSize)
  }

  private collisionedAgainstWalls (parts: Position[], mapSize: number) {
    return parts.some(({ x, y }) => {
      return x < 0 || x >= mapSize ||
             y < 0 || y >= mapSize
    })
  }

  private collisionedAgainstPlayers (players: Player[]) {
    return [...players.values()].some(somePlayer => {
      if (somePlayer === this) {
        return this.collisionedAgainstItself()
      }
      return this.collisionedAgainstOtherPlayers(somePlayer)
    })
  }

  private collisionedAgainstItself () {
    for (let i = 0; i < this.body.length; i++) {
      if (this.head.x === this.body[i].x && this.head.y === this.body[i].y) return true
    }
    return false
  }

  private collisionedAgainstOtherPlayers (somePlayer: Player) {
    if (somePlayer.head.x === this.head.x && somePlayer.head.y === this.head.y) return true
    for (let i = 0; i < somePlayer.body.length; i++) {
      if (this.head.x === somePlayer.body[i].x && this.head.y === somePlayer.body[i].y) return true
    }
    return false
  }
}
