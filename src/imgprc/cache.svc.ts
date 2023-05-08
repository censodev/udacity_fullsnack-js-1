const _cache = new Map<string, Buffer>()

const fetch = (key: string): Buffer | undefined => {
  return _cache.get(key)
}

const cache = (key: string, buffer: Buffer): void => {
  _cache.set(key, buffer)
}

export default { fetch, cache }
