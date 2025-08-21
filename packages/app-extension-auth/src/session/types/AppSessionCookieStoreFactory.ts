import http from 'http'
import { AuthHandlerParams } from '../../storyblok-auth-api'
import { AppSessionStore } from './AppSessionStore'

export type AppSessionCookieStoreFactoryParams = Pick<
  AuthHandlerParams,
  | 'clientId'
  | 'sessionKey'
  | 'clientSecret'
  | 'baseUrl'
  | 'endpointPrefix'
  | 'storyblokApiBaseUrl'
>
export type AppSessionCookieStoreFactory = (
  staticParams: AppSessionCookieStoreFactoryParams,
) => (requestParams: {
  req: http.IncomingMessage
  res: http.ServerResponse
}) => AppSessionStore
