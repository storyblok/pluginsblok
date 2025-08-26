import { redirectUri } from './redirectUri'

describe('redirectUri()', () => {
  it('appends `/callback`', () =>
    expect(
      redirectUri({
        baseUrl: 'https://mydomain.com/base',
        endpointPrefix: 'api/connect',
      }),
    ).toMatch(/\/callback$/))
  it('joins slugs that are trimmed of slashes', () =>
    expect(
      redirectUri({
        baseUrl: 'https://mydomain.com/base',
        endpointPrefix: 'api/connect',
      }),
    ).toEqual('https://mydomain.com/base/api/connect/callback'))
  it('does not cause duplicated slashes (//)', () =>
    expect(
      redirectUri({
        baseUrl: 'https://mydomain.com/base/',
        endpointPrefix: '/api/connect/',
      }),
    ).toEqual('https://mydomain.com/base/api/connect/callback'))
  test('that trailing slash is removed', () =>
    expect(
      redirectUri({
        baseUrl: 'https://mydomain.com/base',
        endpointPrefix: 'api/connect/',
      }),
    ).not.toMatch(/\/$/))
  test('that endpointPrefix is optional', () =>
    expect(
      redirectUri({
        baseUrl: 'https://mydomain.com/base',
        endpointPrefix: undefined,
      }),
    ).toEqual('https://mydomain.com/base/callback'))
})
