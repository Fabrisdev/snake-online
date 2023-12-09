interface ListGamesMessage {
  type: 'list'
}

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

export type ClientMessage =
  ListGamesMessage |
  CreateGameMessage |
  JoinMessage |
  LeaveMessage |
  ChangeDirectionMessage
