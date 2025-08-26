import { getQueryFromUrl } from './get-query-string'

describe('getQueryStringFromUrl() ', () => {
  describe('positive', () => {
    it('should retrieve query parameters', () => {
      const testString = 'https://test.com?hello=2'
      expect(getQueryFromUrl(testString)).not.toBeUndefined()
      expect(getQueryFromUrl(testString)).toBeInstanceOf(URLSearchParams)
      expect(getQueryFromUrl(testString)?.get('hello')).toBe('2')
    })
    it('should retrieve query parameters', () => {
      const testString = '/?hello=2'
      expect(getQueryFromUrl(testString)).not.toBeUndefined()
      expect(getQueryFromUrl(testString)).toBeInstanceOf(URLSearchParams)
      expect(getQueryFromUrl(testString)?.get('hello')).toBe('2')
    })
    it('should retrieve query parameters', () => {
      const testString = '?hello=2'
      expect(getQueryFromUrl(testString)).not.toBeUndefined()
      expect(getQueryFromUrl(testString)).toBeInstanceOf(URLSearchParams)
      expect(getQueryFromUrl(testString)?.get('hello')).toBe('2')
    })
    it('should retrieve query parameters', () => {
      const testString = 'https://test.com/hello/?hello=2'
      expect(getQueryFromUrl(testString)).not.toBeUndefined()
      expect(getQueryFromUrl(testString)).toBeInstanceOf(URLSearchParams)
      expect(getQueryFromUrl(testString)?.get('hello')).toBe('2')
    })
  })

  describe('negative', () => {
    it('should not find any query parameters', () => {
      const testString = 'https://test.com'
      expect(getQueryFromUrl(testString)).toBeUndefined()
    })
    it('should not find any query parameters', () => {
      const testString = '/hello'
      expect(getQueryFromUrl(testString)).toBeUndefined()
    })

    it('should not find any query parameters', () => {
      const testString = ''
      expect(getQueryFromUrl(testString)).toBeUndefined()
    })

    it('should not find any query parameters', () => {
      const testString = 'https://test.com/hello'
      expect(getQueryFromUrl(testString)).toBeUndefined()
    })
  })
})
