import { AppSession } from './types'
import { shouldRefresh } from './shouldRefresh'
import { refreshAppSession } from './refreshAppSession/refreshAppSession'
import { refreshToken } from '../storyblok-auth-api'
import { AuthHandlerParams } from '../storyblok-auth-api'
import { InternalAdapter } from '../session-adapters/internalAdapter'

export type RefreshParams = Pick<
  AuthHandlerParams,
  | 'clientSecret'
  | 'clientId'
  | 'baseUrl'
  | 'endpointPrefix'
  | 'storyblokApiBaseUrl'
>
export type Refresh = (
  params: RefreshParams,
  adapter: InternalAdapter,
  appSession: AppSession | undefined,
) => Promise<AppSession | undefined>

/**
 * Given a stored session and getters and setters for mutating the storage, refreshes the session
 * @param params
 * @param getCookie
 * @param setCookie
 * @param currentAppSession
 */
export const refreshStoredAppSession: Refresh = async (
  params,
  adapter,
  currentAppSession,
) => {
  if (!currentAppSession) {
    // passed undefined
    return undefined
  }
  if (!shouldRefresh(currentAppSession)) {
    // does not need refresh
    return currentAppSession
  }

  // should refresh
  const newAppSession = await refreshAppSession(
    refreshToken(params, currentAppSession.region),
  )(currentAppSession)

  const spaceId = String(currentAppSession.spaceId)
  const userId = String(currentAppSession.userId)

  if (!newAppSession) {
    // Refresh failed -> user becomes unauthenticated
    await adapter.removeSession({
      spaceId,
      userId,
    })
    return undefined
  }

  const result = await adapter.setSession({
    spaceId,
    userId,
    session: newAppSession,
  })
  return result ? newAppSession : undefined
}
