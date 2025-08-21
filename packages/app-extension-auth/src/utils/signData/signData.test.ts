import { signData } from './signData'
import { verifyData } from '../verifyData'

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

describe('signData', () => {
  it('should be the inverse of verifyData', () => {
    expect(testCookieValue).toEqual(
      verifyData(testSecret, signData(testSecret, testCookieValue)),
    )
  })
})
