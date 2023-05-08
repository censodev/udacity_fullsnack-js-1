import sharp from 'sharp'
import cache from './cache.svc'

interface IImgPrcService {
  fetch: (url: string) => Promise<Buffer>
  resize: (
    buffer: Buffer,
    filename: string,
    width: number,
    height: number
  ) => Promise<Buffer>
}

class ImgPrcService implements IImgPrcService {
  async resize(
    buffer: Buffer,
    filename: string,
    width: number,
    height: number
  ): Promise<Buffer> {
    return await sharp(buffer).resize(width, height).toBuffer()
  }

  async fetch(url: string): Promise<Buffer> {
    const fimg = await fetch(new URL(url))
    return Buffer.from(await fimg.arrayBuffer())
  }
}

class ImgPrcProxyService implements IImgPrcService {
  _service = new ImgPrcService()

  async resize(
    buffer: Buffer,
    filename: string,
    width: number,
    height: number
  ): Promise<Buffer> {
    const key = this.genCacheKey(filename, width, height)
    const img: Buffer | undefined = cache.fetch(key)
    if (img !== undefined) return img
    const outputBuffer: Buffer = await this._service.resize(
      buffer,
      filename,
      width,
      height
    )
    cache.cache(key, outputBuffer)
    return outputBuffer
  }

  async fetch(url: string): Promise<Buffer> {
    return await this._service.fetch(url)
  }

  genCacheKey(filename: string, width: number, height: number): string {
    return `${filename}-${width}-${height}`
  }
}

const build = (withCache: boolean = true): IImgPrcService => {
  return withCache ? new ImgPrcProxyService() : new ImgPrcService()
}

export { type IImgPrcService, build }
