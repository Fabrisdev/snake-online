import { getRandomColor } from './utils'
import { players } from './game-manager'

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface PlayerData {
  name: string
  direction: Direction
}

export interface Position {
  x: number
  y: number
}

export interface Player {
  name: string
  position: Position
  direction: Direction
  color: string
  body: Position[]
}

interface RegisterPlayer {
  clientId: string
  players: typeof players
  playerData: PlayerData
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

export function hasCollisioned (player: Player, mapSize: number) {
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
