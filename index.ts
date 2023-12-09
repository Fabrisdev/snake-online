import { startWebSocketsServer } from './servers/websockets'
import { startHttpServer } from './servers/express'

console.log('Starting web sockets server at 8080...')
startWebSocketsServer()
console.log('Starting HTTP server at 3000...')
startHttpServer()
