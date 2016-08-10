/* global describe, before, after, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import nlp from 'nlp_compromise'
import nlpSyllables from '../lib/nlp-syllables-async'
nlp.plugin(nlpSyllables)

const expect = chai.expect

describe('nlp', () => {
  after(() => nlp.syllables.clearCache())
  describe('::termWithSyllables', () => {
    var getTerm
    before(() => getTerm = nlp.termWithSyllables('example'))

    it('should return a promise', () => {
      expect(getTerm.then).to.exist
    })

    it('should resolve to a Term', () => {
      const termConstructor = nlp.term('example').constructor
      return expect(getTerm).to.eventually.be.an.instanceof(termConstructor)
    })

    it('should have a syllables property', () => {
      return expect(getTerm).to.eventually.have.property('syllables')
    })

    it('should resolve to an array', () => {
      return expect(getTerm).to.eventually.have.property('syllables')
        .that.is.an('array')
    })
    it('should resolve to the correct number of syllables', () => {
      return expect(getTerm).to.eventually.have.property('syllables')
        .with.lengthOf(3)
    })
    it('should resolve to the correct syllables', () => {
      return expect(getTerm).to.eventually.have.property('syllables')
        .that.eql(['ex', 'am', 'ple'])
    })
  })
})
