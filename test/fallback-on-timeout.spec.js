/* global describe, it, beforeEach */

import chai from 'chai'
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised'
import sinonChai from 'sinon-chai'
import mochaSinon from 'mocha-sinon'
import fallbackOnTimeout from '../src/fallback-on-timeout'

chai.use(chaiAsPromised)
chai.use(sinonChai)
mochaSinon()

const expect = chai.expect

describe('fallbackOnTimeout', function () {
  // var clock
  // this.timeout(10000)
  // beforeEach(function () clock = sinon.useFakeTimers())

  var waitTime = 500
  var fallbackAfter = waitTime / 2
  var slowPromise
  var slowFunc
  var fallback
  var fallbackPromise
  var slowPromiseThen
  var fallbackPromiseThen
  beforeEach(function () {
    slowPromise = new Promise((resolve, reject) => {
      setTimeout(resolve, waitTime)
    })
    slowPromiseThen = sinon.stub()
    slowPromise.then(slowPromiseThen)

    slowFunc = sinon.stub().returns(slowPromise)
    fallback = sinon.stub()
    fallbackPromise = fallbackOnTimeout(slowFunc, fallback, fallbackAfter)
    fallbackPromiseThen = sinon.stub()
    fallbackPromise.then(fallbackPromiseThen)
  })
  // afterEach(function () clock.restore())

  describe('if fallback time is not reached', function () {
    // beforeEach(function () clock.tick(fallbackAfter - 0.5))
    it('should not have fulfilled the slow promise', function (done) {
      setTimeout(() => {
        expect(slowPromiseThen).to.have.not.been.called
        done()
      }, fallbackAfter - 50)
    })
    it('should have only called the correct functions', function () {
      expect(slowFunc).to.have.been.called
      expect(fallback).to.have.not.been.called
    })
    it('should not have fulfilled the fallback promise', function (done) {
      setTimeout(() => {
        expect(fallbackPromiseThen).to.have.not.been.called
        done()
      }, fallbackAfter - 50)
    })
  })
  describe('if fallback time is reached', function () {
    // beforeEach(function () clock.tick(fallbackAfter + 1))
    it('should not have fulfilled the slow promise', function (done) {
      setTimeout(() => {
        expect(slowPromiseThen).to.have.not.been.called
        done()
      }, fallbackAfter + 10)
    })
    it('should have fulfilled the fallback promise', function (done) {
      setTimeout(() => {
        expect(fallbackPromiseThen).to.have.been.called
        done()
      }, fallbackAfter + 10)
    })
    it('should have called both the slow and fallback functions', function (done) {
      setTimeout(() => {
        expect(slowFunc).to.have.been.called
        expect(fallback).to.have.been.called
        done()
      }, fallbackAfter + 10)
    })
  })
  describe('if waitTime is reached', function () {
    // beforeEach(function () clock.tick(waitTime + 1))
    it('should have resolved the slow promise', function (done) {
      setTimeout(() => {
        expect(slowPromiseThen).to.have.been.called
        done()
      }, waitTime + 10)
    })
  })
})
