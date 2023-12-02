import { startWebSocketsServer } from './servers/websockets'
import { startHttpServer } from './servers/express'

console.log('Starting web sockets server at 8080...')
export const wss = startWebSocketsServer()
console.log('Starting HTTP server at 3000...')
startHttpServer()
