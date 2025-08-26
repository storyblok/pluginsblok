import { expiredCookieHeaderValue } from './expiredCookieHeaderValue'

const cookieName = 'my-cookieName'

describe('expiredCookieHeaderValue', () => {
  it('should contain the expiration attribute', () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain('; expires')
  })
  test('that the expiration date should be the start of Unix epoch', () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain(
      `; expires=${new Date(0).toUTCString()}`,
    )
  })
  it('has no value', () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain(`${cookieName}=""`)
  })
  it('is secure', () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain('; secure')
  })
  it("has the attribute 'samesite=none'", () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain('; samesite=none')
  })
  it("is visible on all paths ('path=/')", () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain('; path=/')
  })
  it("is 'httponly'", () => {
    expect(expiredCookieHeaderValue(cookieName)).toContain('; httponly')
  })
})
