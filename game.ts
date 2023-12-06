import { wss } from './index'
import { getRandomInteger } from './utils'
import { grow, type Position, type Player } from './player'

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
  players.forEach((player, key) => {
    movePlayer(player)
    if (hasCollisioned(player)) {
      players.delete(key)
      return
    }
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
  moveBody(player)
  moveHead(player)
}

function moveHead (player: Player) {
  if (player.direction === 'up') player.position.y -= 1
  if (player.direction === 'down') player.position.y += 1
  if (player.direction === 'left') player.position.x -= 1
  if (player.direction === 'right') player.position.x += 1
}

function moveBody (player: Player) {
  for (let i = player.body.length - 1; i >= 0; i--) {
    player.body[i] = structuredClone(player.body[i - 1]) ?? structuredClone(player.position)
  }
}

function hasCollisioned (player: Player) {
  return collisionedAgainstPlayers(player) || collisionedAgainstWalls([player.position, ...player.body])
}

function collisionedAgainstPlayers (player: Player) {
  return [...players.values()].some(somePlayer => {
    if (somePlayer === player) {
      for (let i = 0; i < player.body.length; i++) {
        if (player.position.x === player.body[i].x && player.position.y === player.body[i].y) return true
      }
      return false
    }
    if (somePlayer.position.x === player.position.x && somePlayer.position.y === player.position.y) return true
    for (let i = 0; i < somePlayer.body.length; i++) {
      for (let j = 0; j < player.body.length; j++) {
        if (player.position.x === somePlayer.body[i].x && player.position.y === somePlayer.body[i].y) return true
        if (somePlayer.body[i].x === player.body[j].x && somePlayer.body[i].y === player.body[j].y) return true
      }
    }
    return false
  })
}

function collisionedAgainstWalls (parts: Position[]) {
  return parts.some(({ x, y }) => {
    return x < 0 || x >= SIZE / PLAYER_SIZE ||
           y < 0 || y >= SIZE / PLAYER_SIZE
  })
}
