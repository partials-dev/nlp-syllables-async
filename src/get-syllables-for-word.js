'use babel'

import scrape from './scrape'
import _ from 'lodash'
import nlp from 'nlp_compromise'
import nlpSyllables from 'nlp-syllables'
import fallbackOnTimeout from 'fallback-on-timeout'
nlp.plugin(nlpSyllables)

const syllableDelimiter = '·'
const selector = '[data-syllable]'

function lookup (word) {
  const url = `http://www.dictionary.com/browse/${word}`
  return scrape(url, selector).then(results => {
    const match = findMatch(word, results)
    var syllableData = match[0].attribs['data-syllable'].split(syllableDelimiter)
    const format = syllable => syllable.replace(/[^a-z]/gi, '').trim()
    syllableData = syllableData.map(format)
    return syllableData
  })
}

function identicalMatch (word, scraped) {
  scraped = scraped.replace(/`${syllableDelimiter}`/g, '')
  scraped = nlp.term(scraped).normal
  word = nlp.term(word).normal
  return scraped === word
}

function rootMatch (word, scraped) {
  scraped = scraped.replace(/`${syllableDelimiter}`/g, '')
  scraped = nlp.text(scraped).root()
  word = nlp.text(word).root()
  return scraped === word
}

function findMatch (word, results) {
  var match = _.find(results, result => identicalMatch(word, result.text()))
  if (!match) {
    match = _.find(results, result => rootMatch(word, result.text()))
  }
  return match
}

export default function getSyllablesForWord (word) {
  const lookupSyllables = () => lookup(word)
  const guessSyllables = () => nlp.term(word).syllables()
  return fallbackOnTimeout(lookupSyllables, guessSyllables, 5000)
    .catch((err) => {
      console.log(`Got an error looking up syllables: ${JSON.stringify(err)}`)
      return guessSyllables()
    })
}
