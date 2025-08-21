import { verifyData } from './verifyData'
import jwt from 'jsonwebtoken'
import { signData } from '../signData'

const testSecret =
  'fkxAHP5whEOjjJh4SFvYvQ9BiqBc8DMqQiX4MMFOcSUx5Qh5xxOI2wqQMRfK53aTOyc5RyEimYQBsA7lWu9kag=='
const testCookieValue = {
  propA: 123,
  propB: 'abc',
  propC: {
    propC1: [1, 2, 3, 'a', 'b', 'c'],
    propC2: null,
  },
}

describe('verifyData', () => {
  it('should be the inverse of signData', () => {
    expect(testCookieValue).toEqual(
      verifyData(testSecret, signData(testSecret, testCookieValue)),
    )
  })
  it('should return undefined if the secret is invalid', () => {
    expect(
      verifyData('incorrectJwtSecret', signData(testSecret, testCookieValue)),
    ).toBeUndefined()
  })
  it('should return undefined if the secret is invalid', () => {
    expect(verifyData(testSecret, 'ey.thisis.gibberish==')).toBeUndefined()
  })
  it('should return undefined if the secret is signed without signSession', () => {
    expect(
      verifyData(testSecret, jwt.sign({ hello: 'world' }, testSecret)),
    ).toBeUndefined()
  })
})
