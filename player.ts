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

export function updatePlayerDirection (clientId: string, direction: Direction): void {
  const player = players.get(clientId)
  if (player === undefined) return
  player.direction = direction
}

export function grow (player: Player) {
  player.body.push(structuredClone(player.body.at(-1) ?? player.position))
}

export function hasCollisioned (player: Player, players: Player[], mapSize: number) {
  return collisionedAgainstPlayers(player) || collisionedAgainstWalls([player.position, ...player.body])

  function collisionedAgainstPlayers (player: Player) {
    return [...players.values()].some(somePlayer => {
      if (somePlayer === player) {
        return collisionedAgainstItself()
      }
      return collisionedAgainstOtherPlayers(somePlayer)
    })

    function collisionedAgainstItself () {
      for (let i = 0; i < player.body.length; i++) {
        if (player.position.x === player.body[i].x && player.position.y === player.body[i].y) return true
      }
      return false
    }

    function collisionedAgainstOtherPlayers (somePlayer: Player) {
      if (somePlayer.position.x === player.position.x && somePlayer.position.y === player.position.y) return true
      for (let i = 0; i < somePlayer.body.length; i++) {
        if (player.position.x === somePlayer.body[i].x && player.position.y === somePlayer.body[i].y) return true
      }
      return false
    }
  }

  function collisionedAgainstWalls (parts: Position[]) {
    return parts.some(({ x, y }) => {
      return x < 0 || x >= mapSize ||
             y < 0 || y >= mapSize
    })
  }
}

export function movePlayer (player: Player) {
  moveBody(player)
  moveHead(player)
}

function moveHead (player: Player) {
  if (player.direction === 'up') player.position.y -= 1
  if (player.direction === 'down') player.position.y += 1
  if (player.direction === 'left') player.position.x -= 1
  if (player.direction === 'right') player.position.x += 1
}

function moveBody (player: Player) {
  for (let i = player.body.length - 1; i >= 0; i--) {
    player.body[i] = structuredClone(player.body[i - 1]) ?? structuredClone(player.position)
  }
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
