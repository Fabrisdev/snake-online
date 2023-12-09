export function handleMessage (clientId: string, data: PlayerData) {
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