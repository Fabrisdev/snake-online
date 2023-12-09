import type Game from './game'

interface CreateGameMessage {
  type: 'create'
}

interface JoinMessage {
  type: 'join'
  name: string
}

interface LeaveMessage {
  type: 'leave'
}

interface ChangeDirectionMessage {
  type: 'changeDirection'
  direction: 'left' | 'right' | 'down' | 'up'
}

type ClientMessage = CreateGameMessage | JoinMessage | LeaveMessage | ChangeDirectionMessage

const games = new Map<string, Game>()

export function handleMessage (clientId: string, message: ClientMessage) {

}
