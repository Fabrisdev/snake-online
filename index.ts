import { WebSocketServer } from 'ws'
import express from 'express'

const wss = new WebSocketServer({ port: 8080 })
type Direction = 'up' | 'down' | 'left' | 'right' | 'stopped'
type RGB = `rgb(${number}, ${number}, ${number})`

interface PlayerData {
  id: string | null
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
    const red = getRandomArbitrary(0, 255)
    const green = getRandomArbitrary(0, 255)
    const blue = getRandomArbitrary(0, 255)
    players.set(clientId, {
      name,
      position: {
        x: 0,
        y: 0
      },
      direction,
      color: `rgb(${red}, ${green}, ${blue})`
    })
    ws.send(JSON.stringify({ clientId }))
  }
})

function updatePlayerDirection ({ id, direction }: PlayerData): void {
  if (id === null) return
  const player = players.get(id)
  if (player === undefined) return
  player.direction = direction
}

function getRandomArbitrary (min: number, max: number): number {
  return Math.random() * (max - min) + min
}

function uniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
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
