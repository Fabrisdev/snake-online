import { type Direction, type PlayerData } from '../player'
import type WebSocket from 'ws'
import { type RawData, WebSocketServer } from 'ws'
import { z } from 'zod'

const ClientData = z.object({
  name: z.string().min(1).max(12),
  direction: z.enum(['up', 'down', 'left', 'right'])
})

export const clients = new Map<string, WebSocket>()

export function startWebSocketsServer () {
  const wss = new WebSocketServer({ port: 8080 })
  wss.on('connection', ws => {
    const clientId = getUniqueId()
    clients.set(clientId, ws)
    ws.on('message', data => {
      const clientData = validateClientData(data)
      if (!clientData.success) return
      if (!validateDirection(clientId, clientData.data.direction)) return
      handleMessage(clientId, clientData.data)
    })

    ws.on('close', () => {
      clients.delete(clientId)
    })
  })
  return wss
}

function validateClientData (clientData: RawData) {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const dataAsJson = JSON.parse(clientData.toString())
  return ClientData.safeParse(dataAsJson)
}

function validateDirection (clientId: string, newDirection: Direction) {
  const player = players.get(clientId)
  if (player === undefined) return true
  if (player.direction === 'left' && newDirection === 'right') return false
  if (player.direction === 'right' && newDirection === 'left') return false
  if (player.direction === 'up' && newDirection === 'down') return false
  if (player.direction === 'down' && newDirection === 'up') return false
  return true
}

function handleMessage (clientId: string, data: PlayerData) {
  if (!players.has(clientId)) {
    registerPlayer({
      clientId,
      players,
      playerData: data
    })
    return
  }
  updatePlayerDirection(clientId, data.direction)
}

function getUniqueId (): string {
  return Math.random().toString(36).substring(2, 15)
}
