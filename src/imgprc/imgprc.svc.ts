import sharp from 'sharp'

const _cache = new Map<string, Buffer>()

const resize = async (
  buffer: Buffer,
  filename: string,
  width: number,
  height: number
): Promise<Buffer> => {
  const img: Buffer | undefined = fetchImgFromCache(filename, width, height)
  if (img !== undefined) return img
  const outputBuffer: Buffer = await sharp(buffer)
    .resize(width, height)
    .toBuffer()
  cacheImg(filename, width, height, outputBuffer)
  return outputBuffer
}

const genCacheKey = (
  filename: string,
  width: number,
  height: number
): string => {
  return `${filename}-${width}-${height}`
}

const fetchImgFromCache = (
  filename: string,
  width: number,
  height: number
): Buffer | undefined => {
  return _cache.get(genCacheKey(filename, width, height))
}

const cacheImg = (
  filename: string,
  width: number,
  height: number,
  buffer: Buffer
): void => {
  _cache.set(genCacheKey(filename, width, height), buffer)
}

export default { resize }
