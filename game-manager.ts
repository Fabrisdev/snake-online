import Game from './game'
import Player, { type Direction } from './player'
import { sendMessage } from './servers/websockets'

interface CreateGameMessage {
  type: 'create'
}

interface JoinMessage {
  type: 'join'
  gameId: string
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

class GameManager extends Map<string, Game> {
  create (clientId: string) {
    games.set(clientId, new Game())
  }

  leaveAll (clientId: string) {
    this.forEach(game => {
      game.removePlayer(clientId)
    })
  }

  join (clientId: string, message: JoinMessage) {
    const game = this.get(message.gameId)
    if (game === undefined) {
      sendMessage(clientId, 'The specified game does not exist.')
      return
    }
    const player = new Player(message.name)
    game.addPlayer(clientId, player)
  }

  changeDirection (clientId: string, direction: Direction) {
    this.forEach(game => {
      game.changePlayerDirection(clientId, direction)
    })
  }
}

const games = new GameManager()

export function handleMessage (clientId: string, message: ClientMessage) {
  if (message.type === 'create') games.create(clientId)
  if (message.type === 'join') games.join(clientId, message)
  if (message.type === 'leave') games.leaveAll(clientId)
  if (message.type === 'changeDirection') games.changeDirection(clientId, message.direction)
}
