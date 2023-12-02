import { type RGB } from './utils'
import { getRandomInteger } from './utils'
import { players } from './index'

export type Direction = 'up' | 'down' | 'left' | 'right' | 'stopped'

export interface PlayerData {
  name: string
  direction: Direction
}

export interface Player {
  name: string
  position: {
    x: number
    y: number
  }
  direction: Direction
  color: RGB
}

interface RegisterPlayer {
  clientId: string
  players: typeof players
  playerData: PlayerData
}

export function registerPlayer ({ clientId, players, playerData }: RegisterPlayer): void {
  const red = getRandomInteger(0, 255)
  const green = getRandomInteger(0, 255)
  const blue = getRandomInteger(0, 255)
  players.set(clientId, {
    position: {
      x: 0,
      y: 0
    },
    color: `rgb(${red}, ${green}, ${blue})`,
    ...playerData
  })
}

export function updatePlayerDirection (clientId: string, direction: Direction): void {
  const player = players.get(clientId)
  if (player === undefined) return
  player.direction = direction
}
