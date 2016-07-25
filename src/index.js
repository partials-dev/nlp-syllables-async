'use babel'

import SyllableDictionary from './syllable-dictionary'
var dictionary = new SyllableDictionary()

function getTermWithSyllables (term) {
  return dictionary.getSyllables(term.normal).then(syllables => {
    term.syllables = syllables
    return term
  })
}

const textAndTermPlugin = {
  Term: {
    getSyllablesAsync () {
      return dictionary.getSyllables(this.normal)
    }
  },
  Text: {
    termsWithSyllables () {
      const terms = this.terms()
      const promises = terms.map(t => getTermWithSyllables(t))
      return Promise.all(promises)
    }
  }
}

const cacheFunctions = {
  clearCache () {
    dictionary.clearCache()
  },
  setCacheEntries (entries) {
    dictionary = new SyllableDictionary(entries)
  },
  serializeCache () {
    return dictionary.serialize()
  }
}

export default function syllablesAsyncPlugin (nlp) {
  nlp.termWithSyllables = (...args) => {
    const term = nlp.term(...args)
    return getTermWithSyllables(term)
  }
  nlp.syllables = cacheFunctions
  return textAndTermPlugin
}

export default syllablesAsyncPlugin
