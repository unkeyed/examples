
import express from "express"
import { withAuth } from "./middleware"
import "dotenv/config"

const app = express()
const port = 3000



app.get('/public', (req, res) => {
  res.send('Hello World!')
})

app.get('/protected', withAuth({permission: "call-protected-route"}), (_req, res) => {
  res.send('Hello protected world')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})