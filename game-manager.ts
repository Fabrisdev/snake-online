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

type ClientMessage = JoinMessage | LeaveMessage | ChangeDirectionMessage

export function handleMessage (clientId: string, data: ClientMessage) {

}
