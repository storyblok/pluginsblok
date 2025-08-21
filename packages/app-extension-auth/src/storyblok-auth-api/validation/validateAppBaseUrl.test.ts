import { validateAppBaseUrl } from './validateAppBaseUrl'

describe('validateAppBaseUrl', () => {
  it('should allow absolute urls with https without query params', () => {
    expect(validateAppBaseUrl('https://my.app.com')).toBeTruthy()
  })
  it('should allow trailing slash', () => {
    expect(validateAppBaseUrl('https://my.app.com/')).toBeTruthy()
  })
  it('should allow a slugs', () => {
    expect(validateAppBaseUrl('https://my.app.com/api')).toBeTruthy()
  })
  it('should allow slugs without trailing slash', () => {
    expect(
      validateAppBaseUrl('https://my.app.com/api/authenticate'),
    ).toBeTruthy()
  })
  it('should allow slugs with trailing slash', () => {
    expect(
      validateAppBaseUrl('https://my.app.com/api/authenticate/'),
    ).toBeTruthy()
  })
  it('should allow without trailing slash', () => {
    expect(validateAppBaseUrl('https://my.app.com')).toBeTruthy()
  })
  it('should disallow http', () => {
    expect(validateAppBaseUrl('http://my.app.com')).toBeFalsy()
  })
  it('should require protocol', () => {
    expect(validateAppBaseUrl('my.app.com')).toBeFalsy()
  })
  it('should disallow query parameters', () => {
    expect(validateAppBaseUrl('https://my.app.com?hello=world')).toBeFalsy()
  })
})
