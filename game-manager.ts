import Game from './game'
import Player, { type Direction } from './player'
import { sendText } from './servers/websockets'
import { type ClientMessage, type JoinMessage } from './messages'

class GameManager extends Map<string, Game> {
  listAll (clientId: string) {
    return [...this.values()].map((game, id) => {
      return {
        id,
        playerCount: game.getPlayerCount()
      }
    })
  }

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
      sendText(clientId, 'The specified game does not exist.')
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
  if (message.type === 'list') games.listAll(clientId)
  if (message.type === 'create') games.create(clientId)
  if (message.type === 'join') games.join(clientId, message)
  if (message.type === 'leave') games.leaveAll(clientId)
  if (message.type === 'changeDirection') games.changeDirection(clientId, message.direction)
}
