/* global describe, before, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import nlp from 'nlp_compromise'
import nlpSyllables from '../lib/nlp-syllables-async'
nlp.plugin(nlpSyllables)

const expect = chai.expect

describe('Text', () => {
  after(() => nlp.syllables.clearCache())
  
  var text
  before(() => text = nlp.text('simple is different from easy'))

  describe('#termsWithSyllables', () => {
    var getTerms
    before(() => getTerms = text.termsWithSyllables())

    it('should return a promise', () => {
      return expect(getTerms.then).to.exist
    })
    it('should resolve to an array', () => {
      return expect(getTerms).to.eventually.be.an.instanceof(Array)
    })
    it('should only contain terms', () => {
      return getTerms.then(terms => {
        const termConstructor = nlp.term('example').constructor
        terms.forEach(term => expect(term).to.be.an.instanceof(termConstructor))
      })
    })
    it('should resolve to the correct number of terms', () => {
      return expect(getTerms).to.eventually.have.lengthOf(5)
    })
    it('should resolve to the correct syllables', () => {
      return getTerms.then(terms => {
        expect(terms[0]).to.have.property('syllables').that.eql(['sim', 'ple'])
        expect(terms[1]).to.have.property('syllables').that.eql(['is'])
        expect(terms[2]).to.have.property('syllables').that.eql(['dif', 'fer', 'ent'])
        expect(terms[3]).to.have.property('syllables').that.eql(['from'])
        expect(terms[4]).to.have.property('syllables').that.eql(['eas', 'y'])
      })
    })
  })
})
