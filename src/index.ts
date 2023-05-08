import express from 'express'
import {
  type IImgPrcService,
  build as buildImgPrcService
} from './imgprc/imgprc.svc'
import stream from 'stream'
import validator from './utils/validator'
// import fetch from 'node-fetch'

const app = express()
const port = 3000

const imgprcService: IImgPrcService = buildImgPrcService()

app.get('/imgprc', async (req, res) => {
  const width: number = validator.checkNumAndParse(
    req.query.width?.toString(),
    () =>
      res.json({
        err: 'param "width" is invalid'
      })
  )
  const height: number = validator.checkNumAndParse(
    req.query.height?.toString(),
    () =>
      res.json({
        err: 'param "height" is invalid'
      })
  )
  if (req.query.filename === undefined || req.query.filename === '') {
    res.json({
      err: 'param "filename" is invalid'
    })
  }
  if (req.query.url === undefined || req.query.url === '') {
    res.json({
      err: 'param "url" is invalid'
    })
  }
  const fimg = await fetch(`${req.query.url?.toString() ?? ''}`)
  const fimgb = Buffer.from(await fimg.arrayBuffer())
  const reesizedImg: Buffer = await imgprcService.resize(
    fimgb,
    `${req.query.filename?.toString() ?? ''}`,
    width,
    height
  )
  const readStream = new stream.PassThrough()
  readStream.end(reesizedImg)
  res.set(
    'Content-disposition',
    `attachment; filename=${req.query.filename?.toString() ?? ''}`
  )
  res.set('Content-Type', 'image/png')
  readStream.pipe(res)
})

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
