import { WebSocketServer } from 'ws'
import express from 'express'

const wss = new WebSocketServer({ port: 8080 })
type Direction = 'up' | 'down' | 'left' | 'right' | 'stopped'
type RGB = `rgb(${number}, ${number}, ${number})`

interface PlayerData {
  name: string
  direction: Direction
}

interface Player {
  name: string
  position: {
    x: number
    y: number
  }
  direction: Direction
  color: RGB
}
const players = new Map<string, Player>()

wss.on('connection', ws => {
  const clientId = uniqueId()
  ws.on('message', data => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const playerData = JSON.parse(data.toString()) as PlayerData
    if (!players.has(clientId)) registerPlayer(playerData)
    updatePlayerDirection(playerData)
  })

  ws.on('close', () => {
    players.delete(clientId)
  })

  function registerPlayer ({ name, direction }: PlayerData): void {
    const red = getRandomInteger(0, 255)
    const green = getRandomInteger(0, 255)
    const blue = getRandomInteger(0, 255)
    players.set(clientId, {
      name,
      position: {
        x: 0,
        y: 0
      },
      direction,
      color: `rgb(${red}, ${green}, ${blue})`
    })
  }

  function updatePlayerDirection ({ direction }: PlayerData): void {
    const player = players.get(clientId)
    if (player === undefined) return
    player.direction = direction
  }
})

function getRandomInteger (min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

function uniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
}

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
