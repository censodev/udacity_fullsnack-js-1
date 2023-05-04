import express from 'express'
import imgprc from './routes/imgprc.rt'

const app = express()
const port = 3000

app.use('/imgprc', imgprc)

app.get('/', (req, res) => {
  res.json({ greet: 'Hello World!' })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
