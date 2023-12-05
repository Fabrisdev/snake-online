import { wss } from './index'
import { getRandomInteger } from './utils'
import { grow, type Player } from './player'

const CYCLE_SPEED = 200
setInterval(gameCycle, CYCLE_SPEED)

const SIZE = 500
const PLAYER_SIZE = 25

const applePosition = {
  x: getRandomInteger(0, SIZE / PLAYER_SIZE),
  y: getRandomInteger(0, SIZE / PLAYER_SIZE)
}
export const players = new Map<string, Player>()

function gameCycle (): void {
  players.forEach(player => {
    movePlayer(player)
    if (player.position.x === applePosition.x && player.position.y === applePosition.y) {
      repositionApple()
      grow(player)
    }
  })
  const playersAsArray = Array.from(players.values())

  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      apple: applePosition,
      players: playersAsArray
    }))
  })
}

function repositionApple () {
  applePosition.x = getRandomInteger(0, SIZE / PLAYER_SIZE)
  applePosition.y = getRandomInteger(0, SIZE / PLAYER_SIZE)
}

function movePlayer (player: Player) {
  if (player.direction === 'up') player.position.y -= 1
  if (player.direction === 'down') player.position.y += 1
  if (player.direction === 'left') player.position.x -= 1
  if (player.direction === 'right') player.position.x += 1
}
