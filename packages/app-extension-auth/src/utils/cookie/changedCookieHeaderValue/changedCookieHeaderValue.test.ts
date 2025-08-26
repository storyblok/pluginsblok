import { changedCookieHeaderValue } from './changedCookieHeaderValue'

const cookieName = 'my-testCookie'
const cookieValue = 'abc-123&;/abc-_'

describe('changedCookieHeaderValue', () => {
  it('should not contain the expiration attribute', () => {
    expect(changedCookieHeaderValue(cookieName, cookieValue)).not.toContain(
      '; expires',
    )
  })
  it('has a value', () => {
    expect(changedCookieHeaderValue(cookieName, cookieValue)).toMatch(
      new RegExp(`^${cookieName}=.+;`),
    )
  })
  it.todo('url encodes the value')
  it('is secure', () => {
    expect(changedCookieHeaderValue(cookieName, cookieValue)).toContain(
      '; secure',
    )
  })
  it("has the attribute 'samesite=none'", () => {
    // TODO is this attribute really necessary?
    expect(changedCookieHeaderValue(cookieName, cookieValue)).toContain(
      '; samesite=none',
    )
  })
  it("is visible on all paths ('path=/')", () => {
    expect(changedCookieHeaderValue(cookieName, cookieValue)).toContain(
      '; path=/',
    )
  })
  it("is 'httponly'", () => {
    expect(changedCookieHeaderValue(cookieName, cookieValue)).toContain(
      '; httponly',
    )
  })
})
