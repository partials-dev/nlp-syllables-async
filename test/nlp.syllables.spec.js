/* global describe, it, afterEach */

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
chai.use(chaiAsPromised)

import nlp from 'nlp_compromise'
import nlpSyllables from '../lib/nlp-syllables-async'
nlp.plugin(nlpSyllables)

const expect = chai.expect

describe('nlp', () => {
  afterEach(() => nlp.syllables.clearCache())
  describe('::syllables', () => {
    describe('::serializeCache', () => {
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
      it('should behave the same when called multiple times', () => {
        return nlp.termWithSyllables('example').then(() => {
          var cache = nlp.syllables.serializeCache()
          expect(cache).to.have.lengthOf(1)

          nlp.syllables.clearCache()
          nlp.syllables.clearCache()
          cache = nlp.syllables.serializeCache()
          expect(cache).to.eql([])
        })
      })
    }),
    describe('::setCacheEntries', () => {
      it('should use the same data format as `::serializeCache`', () => {
        return nlp.termWithSyllables('example').then(() => {
          var populatedCache = nlp.syllables.serializeCache()
          expect(populatedCache).to.have.lengthOf(1)

          nlp.syllables.clearCache()
          var emptyCache = nlp.syllables.serializeCache()
          expect(emptyCache).to.eql([])

          nlp.syllables.clearCache()
          nlp.syllables.setCacheEntries(populatedCache)
          var newCache = nlp.syllables.serializeCache()
          expect(newCache).to.eql(populatedCache)
        })
      })
    })
  })
})
