/* global describe, before, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import nlp from 'nlp_compromise'
import nlpSyllables from '../lib/nlp-syllables-async'
nlp.plugin(nlpSyllables)

const expect = chai.expect

describe('Term', () => {
  after(() => nlp.syllables.clearCache())
  
  var term
  before(() => term = nlp.term('example'))

  describe('#getSyllablesAsync', () => {
    var getSyllables
    before(() => getSyllables = term.getSyllablesAsync())

    it('should return a promise', () => {
      return expect(getSyllables.then).to.exist
    })
    it('should resolve to an array', () => {
      return expect(getSyllables).to.eventually.be.an.instanceof(Array)
    })
    it('should resolve to an array of strings', () => {
      getSyllables.then(syllables => {
        syllables.forEach(s => expect(s).to.be.an.instanceof(String))
      })
    })
    it('should resolve to the correct number of syllables', () => {
      return expect(getSyllables).to.eventually.have.lengthOf(3)
    })
    it('should resolve to the correct syllables', () => {
      return expect(getSyllables).to.eventually.eql(['ex', 'am', 'ple'])
    })
  })
})
