import { WebSocketServer } from 'ws'
import express from 'express'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection (ws) {
  ws.on('error', console.error)

  ws.on('message', function message (data) {
    console.log('received: %s', data)
  })
  console.log('ola')
  ws.send('something')
})

const app = express()

app.use(express.static('public'))
app.listen(3000)
