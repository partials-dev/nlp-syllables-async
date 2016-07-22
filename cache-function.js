'use babel'

import Cache from './persistent-cache'

function setIfDoesNotExist (cache, key, value) {
  const cached = cache.get(key)
  if (!cached) {
    cache.set(key, value)
  }
}

export default function cacheFunction (func) {
  var cache = new Cache()
  const cachedFunction = (key) => {
    const value = cache.get(key) || func(key)
    setIfDoesNotExist(cache, key, value)
    return value
  }
  cachedFunction.clearCache = () => {
    cache = null
    cache = new Cache()
  }
  cachedFunction.serialize = () => {
    return cache.serialize()
  }
  return cachedFunction
}
