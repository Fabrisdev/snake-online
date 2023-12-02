import { WebSocketServer } from 'ws'
import express from 'express'
import { getUniqueId, getRandomInteger } from './utils'
import { registerPlayer, updatePlayerDirection, type Player, type PlayerData } from './player'

const wss = new WebSocketServer({ port: 8080 })

export const players = new Map<string, Player>()

wss.on('connection', ws => {
  const clientId = getUniqueId()
  ws.on('message', data => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const playerData = JSON.parse(data.toString()) as PlayerData
    if (!players.has(clientId)) {
      registerPlayer({
        clientId,
        players,
        playerData
      })
    }
    updatePlayerDirection(clientId, playerData.direction)
  })

  ws.on('close', () => {
    players.delete(clientId)
  })
})

const CYCLE_SPEED = 200
setInterval(gameCycle, CYCLE_SPEED)
const SIZE = 500
const PLAYER_SIZE = 25
const applePosition = {
  x: getRandomInteger(0, SIZE / PLAYER_SIZE),
  y: getRandomInteger(0, SIZE / PLAYER_SIZE)
}

function gameCycle (): void {
  players.forEach(player => {
    if (player.direction === 'up') player.position.y -= 1
    if (player.direction === 'down') player.position.y += 1
    if (player.direction === 'left') player.position.x -= 1
    if (player.direction === 'right') player.position.x += 1
    if (player.position.x === applePosition.x && player.position.y === applePosition.y) {
      applePosition.x = getRandomInteger(0, SIZE / PLAYER_SIZE)
      applePosition.y = getRandomInteger(0, SIZE / PLAYER_SIZE)
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

const app = express()

app.use(express.static('public'))
app.listen(3000)
