import { getUniqueId } from '../utils'
import { registerPlayer, type PlayerData, updatePlayerDirection } from '../player'
import { players } from '../game'
import { WebSocketServer } from 'ws'

export function startWebSocketsServer (): WebSocketServer {
  const wss = new WebSocketServer({ port: 8080 })
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
  return wss
}
