export interface ListGamesMessage {
  type: 'list'
}

export interface CreateGameMessage {
  type: 'create'
}

export interface JoinMessage {
  type: 'join'
  gameId: string
  name: string
}

export interface LeaveMessage {
  type: 'leave'
}

export interface ChangeDirectionMessage {
  type: 'changeDirection'
  direction: 'left' | 'right' | 'down' | 'up'
}

export type ClientMessage =
  ListGamesMessage |
  CreateGameMessage |
  JoinMessage |
  LeaveMessage |
  ChangeDirectionMessage
