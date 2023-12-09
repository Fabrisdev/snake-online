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

const games = new Map<string, Game>()

export function handleMessage (clientId: string, message: ClientMessage) {
  if (message.type === 'create') createGame(clientId)
  if (message.type === 'join') joinGame(clientId, message)
  if (message.type === 'leave') leaveGames(clientId)
  if (message.type === 'changeDirection') changeDirection(clientId, message.direction)
}

function createGame (clientId: string) {
  games.set(clientId, new Game())
}

function joinGame (clientId: string, message: JoinMessage) {
  const game = games.get(message.gameId)
  if (game === undefined) { sendMessage(clientId, 'The specified game does not exist.'); return }
  const player = new Player(message.name)
  game.addPlayer(clientId, player)
}

function leaveGames (clientId: string) {
  games.forEach(game => {
    game.removePlayer(clientId)
  })
}

function changeDirection (clientId: string, direction: Direction) {
  games.forEach(game => {
    game.changePlayerDirection(clientId, direction)
  })
}
