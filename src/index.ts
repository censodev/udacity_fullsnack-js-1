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
  const width: number | undefined = validator.checkNumAndParse(
    req.query.width?.toString()
  )
  if (width === undefined) {
    res.json({
      err: 'param "width" is invalid'
    })
    return
  }
  const height: number | undefined = validator.checkNumAndParse(
    req.query.height?.toString()
  )
  if (height === undefined) {
    res.json({
      err: 'param "height" is invalid'
    })
    return
  }
  if (req.query.filename === undefined || req.query.filename === '') {
    res.json({
      err: 'param "filename" is invalid'
    })
    return
  }
  if (req.query.url === undefined || req.query.url === '') {
    res.json({
      err: 'param "url" is invalid'
    })
    return
  }
  const fimgb = await imgprcService.fetch(`${req.query.url?.toString() ?? ''}`)
  if (fimgb === undefined) {
    res.json({
      err: 'param "url" is invalid'
    })
    return
  }

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
