import { signData } from './signData'
import { verifyData } from '../verifyData'

const testSecret = 'test-secret-not-a-real-credential'
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
