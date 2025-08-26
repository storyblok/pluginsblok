import { appendQueryParams } from './append-query-params'

describe('appendQueryParams()', () => {
  it('should work for urls without trailing slash', () => {
    expect(
      appendQueryParams('https://test.com', {
        page: '1',
      }),
    ).toBe('https://test.com/?page=1')
  })
  it('should work for urls with trailing slash', () => {
    expect(
      appendQueryParams('https://test.com/', {
        page: '1',
      }),
    ).toBe('https://test.com/?page=1')
  })

  it('should work for multiple query parameters', () => {
    expect(
      appendQueryParams('https://test.com', {
        page: '1',
        per_page: '12',
      }),
    ).toBe('https://test.com/?page=1&per_page=12')
  })

  it('should work for relative URLs', () => {
    expect(
      appendQueryParams('pages', {
        id: '123',
      }),
    ).toBe('pages?id=123')
  })

  it('should work for absolute URLs', () => {
    expect(
      appendQueryParams('/pages', {
        page: '1',
      }),
    ).toBe('/pages?page=1')
  })

  it('should append query parameters', () => {
    expect(
      appendQueryParams('/articles?page=1', {
        per_page: '12',
      }),
    ).toBe('/articles?page=1&per_page=12')
  })

  it('should replace query parameters', () => {
    expect(
      appendQueryParams('/articles?page=1', {
        page: '2',
        per_page: '12',
      }),
    ).toBe('/articles?page=2&per_page=12')
  })
})
