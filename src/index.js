import SyllableDictionary from './syllable-dictionary'
const defaultTimeout = 1000
var dictionary = new SyllableDictionary(null, defaultTimeout)
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

const settings = {
  timeout: defaultTimeout,
  clearCache () {
    dictionary.clearCache()
  },
  setCacheEntries (entries) {
    dictionary = new SyllableDictionary(entries, this.timeout)
  },
  serializeCache () {
    return dictionary.serialize()
  },
  setTimeout (timeout) {
    this.timeout = timeout
    const serialized = this.serializeCache()
    dictionary = new SyllableDictionary(serialized, this.timeout)
  }
}

export default function syllablesAsyncPlugin (nlp) {
  nlp.termWithSyllables = (...args) => {
    const term = nlp.term(...args)
    return getTermWithSyllables(term)
  }
  nlp.syllables = settings
  return textAndTermPlugin
}

export default syllablesAsyncPlugin
