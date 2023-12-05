import { type RGB } from './utils'
import { getRandomInteger } from './utils'
import { players } from './game'

export type Direction = 'up' | 'down' | 'left' | 'right' | 'stopped'

export interface PlayerData {
  name: string
  direction: Direction
}

interface Position {
  x: number
  y: number
}

export interface Player {
  name: string
  position: Position
  direction: Direction
  color: RGB
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
    color: getRandomRGB(),
    ...playerData
  })
}

export function updatePlayerDirection (clientId: string, direction: Direction): void {
  const player = players.get(clientId)
  if (player === undefined) return
  player.direction = direction
}

function getRandomRGB (): `rgb(${number}, ${number}, ${number})` {
  const red = getRandomInteger(0, 255)
  const green = getRandomInteger(0, 255)
  const blue = getRandomInteger(0, 255)
  return `rgb(${red}, ${green}, ${blue})`
}
