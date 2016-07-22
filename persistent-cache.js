'use babel'

import moment from 'moment'

class CachedValue {
  constructor (value, ttlOrExpiration = [1, 'days']) {
    this.value = value
    if (typeof ttlOrExpiration === 'string') {
      let expiration = ttlOrExpiration
      this.expiration = moment(expiration)
    } else {
      const ttl = ttlOrExpiration
      const [n, units] = ttl
      this.expiration = moment().add(n, units)
    }
  }
  isExpired () {
    const now = moment()
    return now.isAfter(this.expiration)
  }
}

export default class PersistentCache {
  constructor (data) {
    this.cache = {}
    if (data) {
      data.forEach((datum) => {
        this.cache[datum.key] = new CachedValue(datum.value, datum.expiration)
      })
      this.clean()
    }
  }
  get (key) {
    this.clean(key)
    const cached = this.cache[key]
    if (cached) {
      return cached.value
    }
  }
  set (key, value, ttlOrExpiration = [1, 'days']) {
    this.cache[key] = new CachedValue(value, ttlOrExpiration)
  }
  clean (key) {
    if (key) {
      const cached = this.cache[key]
      if (!cached) {
        delete this[key]
      }

      if (cached && cached.isExpired()) {
        this.cache[key] = null
        delete this[key]
      }
    } else {
      Object.keys(this.cache).forEach((key) => {
        this.clean(key)
      })
    }
  }
  serialize () {
    this.clean()
    return Object.keys(this.cache).map((key) => {
      const cached = this.cache[key]
      return {
        key: key,
        value: cached.value,
        expiration: cached.expiration.format()
      }
    })
  }
}
