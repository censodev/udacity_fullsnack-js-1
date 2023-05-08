import express from 'express'
import {
  type IImgPrcService,
  build as buildImgPrcService
} from './imgprc/imgprc.svc'
import stream from 'stream'

const app = express()
const port = 3000

const imgprcService: IImgPrcService = buildImgPrcService()

app.get(
  '/imgprc',
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    const width = Number(req.query.width as string)
    const height = Number(req.query.height as string)
    const filename = req.query.filename as string
    const url = req.query.url as string
    if (width <= 0) {
      next(new Error('width is invalid'))
      return
    }
    if (height <= 0) {
      next(new Error('height is invalid'))
      return
    }
    if (filename === '') {
      next(new Error('filename is invalid'))
      return
    }
    if (url === '') {
      next(new Error('url is invalid'))
      return
    }
    const img = await imgprcService.fetch(url)

    const resizedImg: Buffer = await imgprcService.resize(
      img,
      filename,
      width,
      height
    )
    const readStream = new stream.PassThrough()
    readStream.end(resizedImg)
    res.set('Content-disposition', `attachment; filename=${filename}`)
    res.set('Content-Type', 'image/png')
    readStream.pipe(res)
  }
)

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack)
    res.json({
      err: err.message
    })
  }
)

app.listen(port, () => {
  console.log(`App is listening on port ${port}`)
})
