/* global describe, before, it */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import nlp from 'nlp_compromise'
import nlpSyllables from '../lib/nlp-syllables-async'
nlp.plugin(nlpSyllables)

const expect = chai.expect

describe('nlp', () => {
  describe('::syllables', () => {
    describe('::serializeCache', () => {
      afterEach(() => nlp.syllables.clearCache())

      it('[0 lookups] should return an empty array', () => {
        const cache = nlp.syllables.serializeCache()
        expect(cache).to.eql([])
      })
      it('[1 lookup] should contain one word', () => {
        return nlp.termWithSyllables('example').then(() => {
          const cache = nlp.syllables.serializeCache()

          expect(cache).to.have.lengthOf(1)
          expect(cache[0]).to.have.property('key').that.eql('example')
          expect(cache[0]).to.have.property('value').that.eql(['ex', 'am', 'ple'])
        })
      })
      it('[2 lookups] should contain two words', () => {
        return nlp.termWithSyllables('example').then(() => {
          return nlp.termWithSyllables('science')
        }).then(() => {
          const cache = nlp.syllables.serializeCache()

          expect(cache).to.have.lengthOf(2)
          expect(cache[0]).to.have.property('key').that.eql('example')
          expect(cache[0]).to.have.property('value').that.eql(['ex', 'am', 'ple'])

          expect(cache[1]).to.have.property('key').that.eql('science')
          expect(cache[1]).to.have.property('value').that.eql(['sci', 'ence'])
        })
      })
    })
    describe('::clearCache', () => {
      it('should clear the cache', () => {
        return nlp.termWithSyllables('example').then(() => {
          var cache = nlp.syllables.serializeCache()
          expect(cache).to.have.lengthOf(1)

          nlp.syllables.clearCache()
          cache = nlp.syllables.serializeCache()
          expect(cache).to.eql([])
        })
      })
    })
  })
})
