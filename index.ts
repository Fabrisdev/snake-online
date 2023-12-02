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
  position: {
    x: number
    y: number
  }
  direction: Direction
  color: RGB
}
const players = new Map<string, Player>()

wss.on('connection', ws => {
  ws.on('message', data => {
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    const playerData = JSON.parse(data.toString()) as PlayerData
    if (!players.has(playerData.name)) registerPlayer(playerData.name, playerData.direction)
    updatePlayerDirection(playerData.name, playerData.direction)
  })
})

function updatePlayerDirection (name: string, direction: Direction): void {
  const player = players.get(name)
  if (player === undefined) return
  player.direction = direction
}

function registerPlayer (name: string, direction: Direction): void {
  const red = getRandomArbitrary(0, 255)
  const green = getRandomArbitrary(0, 255)
  const blue = getRandomArbitrary(0, 255)
  players.set(name, {
    position: {
      x: 0,
      y: 0
    },
    direction,
    color: `rgb(${red}, ${green}, ${blue})`
  })
}

function getRandomArbitrary (min: number, max: number): number {
  return Math.random() * (max - min) + min
}

const CYCLE_SPEED = 200
setInterval(gameCycle, CYCLE_SPEED)

function gameCycle (): void {
  players.forEach(player => {
    if (player.direction === 'up') player.position.y -= 1
    if (player.direction === 'down') player.position.y += 1
    if (player.direction === 'left') player.position.x -= 1
    if (player.direction === 'right') player.position.x += 1
  })
  const playersAsArray = Array.from(players.values())

  wss.clients.forEach(client => {
    client.send(JSON.stringify(playersAsArray))
  })
}

const app = express()

app.use(express.static('public'))
app.listen(3000)
