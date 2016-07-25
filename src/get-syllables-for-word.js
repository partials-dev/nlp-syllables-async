'use babel'

import scrape from './scrape'
import _ from 'lodash'
import nlp from 'nlp_compromise'
import nlpSyllables from 'nlp-syllables'
nlp.plugin(nlpSyllables)

const syllableDelimiter = '·'
const selector = '[data-syllable]'

function lookup (word) {
  const url = `http://www.dictionary.com/browse/${word}`
  return scrape(url, selector).then(results => findMatch(word, results))
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

function getOrGuessSyllables (word, result) {
  if (result) {
    return result[0].attribs['data-syllable'].split(syllableDelimiter)
  } else {
    return nlp.term(word).syllables()
  }
}

export default function getSyllablesForWord (word) {
  return lookup(word).then((result) =>
    getOrGuessSyllables(word, result)
  ).catch((err) => {
    console.log(`Got an error: ${JSON.stringify(err)}`)
    return nlp.term(word).syllables()
  })
}
