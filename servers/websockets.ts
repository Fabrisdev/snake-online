import type WebSocket from 'ws'
import { type RawData, WebSocketServer } from 'ws'
import { z } from 'zod'
import { handleMessage } from '../game-manager'
import { getUniqueId } from '../utils'

export const clients = new Map<string, WebSocket>()

export function startWebSocketsServer () {
  const wss = new WebSocketServer({ port: 8080 })
  wss.on('connection', ws => {
    const clientId = getUniqueId()
    clients.set(clientId, ws)
    ws.on('message', data => {
      const clientData = validateClientData(data)
      if (!clientData.success) return
      handleMessage(clientId, clientData.data)
    })

    ws.on('close', () => {
      clients.delete(clientId)
    })
  })
  return wss
}

function validateClientData (clientData: RawData) {
  const ClientData = z.discriminatedUnion('type', [
    z.object({
      type: z.literal('create')
    }),
    z.object({
      type: z.literal('join'),
      gameId: z.string(),
      name: z.string().min(3).max(12)
    }),
    z.object({
      type: z.literal('leave')
    }),
    z.object({
      type: z.literal('changeDirection'),
      direction: z.enum(['left', 'right', 'down', 'up'])
    })
  ])

  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const dataAsJson = JSON.parse(clientData.toString())
  return ClientData.safeParse(dataAsJson)
}

export function sendMessage (clientId: string, message: string) {
  const client = clients.get(clientId)
  if (client === undefined) return
  client.send(JSON.stringify({
    message
  }))
}
