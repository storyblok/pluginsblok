import {
  AppSessionCookieStoreFactory,
  AppSessionQuery,
  AppSessionStore,
} from './types'
import { refreshStoredAppSession } from './refreshStoredAppSession'
import { createCookieAdapter } from '../session-adapters/createCookieAdapter'
import { createInternalAdapter } from '../session-adapters/internalAdapter'
import { IncomingMessage } from 'http'
import { getQueryFromUrl } from '../utils/query-params/get-query-string'

export const getSessionStore: AppSessionCookieStoreFactory =
  (params) =>
  (requestParams): AppSessionStore => {
    const adapter = createInternalAdapter({
      params,
      req: requestParams.req,
      res: requestParams.res,
      adapter: createCookieAdapter({
        sessionKey: params.sessionKey,
        clientSecret: params.clientSecret,
      }),
    })

    return {
      get: async ({ spaceId, userId }) => {
        const session = await adapter.getSession({
          spaceId: String(spaceId),
          userId: String(userId),
        })
        return await refreshStoredAppSession(params, adapter, session)
      },
      getAll: async () => {
        const sessions = await adapter.getAllSessions?.()

        return sessions || []
      },
      put: async (session) =>
        await adapter.setSession({
          spaceId: String(session.spaceId),
          userId: String(session.userId),
          session,
        }),
      remove: async ({ spaceId, userId }) =>
        await adapter.removeSession({
          spaceId: String(spaceId),
          userId: String(userId),
        }),
    }
  }

export const inferSessionQuery = (
  req: IncomingMessage,
): AppSessionQuery | undefined => {
  if (!req.url) {
    return
  }

  const sessionFromUrl = getSessionFromUrl(req.url)

  if (sessionFromUrl) {
    return sessionFromUrl
  }

  if (req.headers.referer) {
    return getSessionFromUrl(req.headers.referer)
  }

  return undefined
}

const getSessionFromUrl = (url: string): AppSessionQuery | undefined => {
  const query = getQueryFromUrl(url)

  if (!query) {
    return undefined
  }

  const spaceId = query.get('space_id') || query.get('spaceId')
  const userId = query.get('user_id') || query.get('userId')

  if (!spaceId || !userId) {
    return undefined
  }

  return {
    spaceId,
    userId,
  }
}
