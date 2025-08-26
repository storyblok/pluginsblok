import { validateEndpointPrefix } from './validateEndpointPrefix'

describe('validateEndpointPrefix', () => {
  it('should allow single words', () => {
    expect(validateEndpointPrefix('this')).toBeTruthy()
  })
  it('should allow underscores', () => {
    expect(validateEndpointPrefix('this_is_a_path')).toBeTruthy()
  })
  it('should allow dashes', () => {
    expect(validateEndpointPrefix('this-is-a-path')).toBeTruthy()
  })
  it('should allow numbers', () => {
    expect(validateEndpointPrefix('path123456789')).toBeTruthy()
  })
  it('should allow slashes', () => {
    expect(validateEndpointPrefix('this/is/a/path')).toBeTruthy()
  })
  it('should work without trailing slashes', () => {
    expect(validateEndpointPrefix('this/is/a/path')).toBeTruthy()
  })
  it('should work without leading slashes', () => {
    expect(validateEndpointPrefix('this/is/a/path')).toBeTruthy()
  })
  it('should work with trailing slashes', () => {
    expect(validateEndpointPrefix('this/is/a/path/')).toBeTruthy()
  })
  it('should work with leading slashes', () => {
    expect(validateEndpointPrefix('/this/is/a/path')).toBeTruthy()
  })
  it('should disallow domains', () => {
    expect(validateEndpointPrefix('test.com/this/is/a/path')).toBeFalsy()
  })
  it('should disallow protocol', () => {
    expect(
      validateEndpointPrefix('https://test.com/this/is/a/path'),
    ).toBeFalsy()
  })
  it('should disallow query parameters', () => {
    expect(validateEndpointPrefix('this/is/a/path?with=query')).toBeFalsy()
  })
})
