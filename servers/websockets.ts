import { getUniqueId } from '../utils'
import { registerPlayer, updatePlayerDirection } from '../player'
import { players } from '../game'
import { type RawData, WebSocketServer } from 'ws'
import { z } from 'zod'
import { type PlayerData } from '../player'

const ClientData = z.object({
  name: z.string().min(1).max(12),
  direction: z.enum(['up', 'down', 'left', 'right', 'stopped'])
})

export function startWebSocketsServer () {
  const wss = new WebSocketServer({ port: 8080 })
  wss.on('connection', ws => {
    const clientId = getUniqueId()

    ws.on('message', data => {
      const clientData = validateClientData(data)
      if (!clientData.success) return
      handleMessage(clientId, clientData.data)
    })

    ws.on('close', () => {
      players.delete(clientId)
    })
  })
  return wss
}

function validateClientData (clientData: RawData) {
  // eslint-disable-next-line @typescript-eslint/no-base-to-string
  const dataAsJson = JSON.parse(clientData.toString())
  return ClientData.safeParse(dataAsJson)
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
