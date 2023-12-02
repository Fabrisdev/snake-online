import express from 'express'

export function startHttpServer (): void {
  const app = express()
  app.use(express.static('public'))
  app.listen(3000)
}
