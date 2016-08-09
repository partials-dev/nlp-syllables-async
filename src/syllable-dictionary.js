'use babel'

import getSyllablesForWord from './get-syllables-for-word'
import cacheFunction from './cache-function'
import _ from 'lodash'

function getType (text) {
  if (Array.isArray(text)) return 'array'
  else if (text.indexOf(' ') > -1) return 'phrase'
  else return 'word'
}

export default class SyllableDictionary {
  constructor (cacheEntries, timeout) {
    const getCachedSyllablesForWord = cacheFunction(getSyllablesForWord, cacheEntries)
    this.getCachedSyllablesForWord = getCachedSyllablesForWord
    this.timeout = timeout
  }
  getSyllables (text) {
    switch (getType(text)) {
      case 'array': return this.getSyllablesForArray(text)
      case 'phrase': return this.getSyllablesForPhrase(text)
      case 'word': return this.getCachedSyllablesForWord(text, this.timeout)
    }
  }
  getSyllablesForArray (array) {
    const syllablePromises = array.map(word => this.getSyllables(word))
    return Promise.all(syllablePromises)
  }
  getSyllablesForPhrase (phrase) {
    const array = phrase.split(' ')
    return this.getSyllables(array).then(words => {
      const syllables = _(words).map('syllables').flatten().value()
      return syllables
    })
  }
  clearCache () {
    this.getCachedSyllablesForWord.clearCache()
  }
  serialize () {
    return this.getCachedSyllablesForWord.serialize()
  }
}
