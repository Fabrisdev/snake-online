import { getRandomColor } from './utils'
import { players } from './game'

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
