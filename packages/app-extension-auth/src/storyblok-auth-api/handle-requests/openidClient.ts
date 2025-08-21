import { BaseClient, Issuer, custom } from 'openid-client'
import { redirectUri } from './redirectUri'
import { AuthHandlerParams } from '../AuthHandlerParams'
import { getRegionBaseUrl, Region } from '@storyblok/region-helper'

export type CreateOpenIdClient = (
  params: Pick<
    AuthHandlerParams,
    | 'clientId'
    | 'clientSecret'
    | 'baseUrl'
    | 'endpointPrefix'
    | 'storyblokApiBaseUrl'
  >,
  region?: Region,
) => BaseClient

export const openidClient: CreateOpenIdClient = (params, region) => {
  const defaultEndpoint = region
    ? `${getRegionBaseUrl(region)}`
    : 'https://app.storyblok.com'

  const { clientId, clientSecret, storyblokApiBaseUrl = undefined } = params
  const oauthEndpoint = storyblokApiBaseUrl ?? defaultEndpoint

  const { Client } = new Issuer({
    issuer: 'storyblok',
    // At this point there is no region && the subdomains do not have the /oauth/authorize endpoint working at the moment that is why this endpoint is initially requested
    authorization_endpoint: `${oauthEndpoint}/oauth/authorize`,
    token_endpoint: `${oauthEndpoint}/oauth/token`,
    userinfo_endpoint: `${oauthEndpoint}/oauth/user_info`,
  })

  const client = new Client({
    token_endpoint_auth_method: 'client_secret_post',
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uris: [redirectUri(params)],
    response_types: ['code'],
  })

  // eslint-disable-next-line functional/immutable-data
  client[custom.http_options] = () => {
    return { timeout: 10000 }
  }

  return client
}
