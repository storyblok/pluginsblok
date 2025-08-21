import { appendQueryParams } from '../../../utils/query-params/append-query-params'
import { AuthHandlerParams } from '../../AuthHandlerParams'
import { regionFromUrl } from './spaceIdFromUrl'
import { HandleAuthRequest } from '../HandleAuthRequest'
import { fetchAppSession } from './fetchAppSession'
import { InternalAdapter } from '../../../session-adapters/internalAdapter'

export type AppSessionQueryParams = {
  space_id: string
  user_id: string
}

export const handleCallbackRequest: HandleAuthRequest<{
  params: AuthHandlerParams
  url: string
  adapter: InternalAdapter
}> = async ({ params, url, adapter }) => {
  try {
    const region = regionFromUrl(url)
    if (!region) {
      return {
        type: 'error',
        message: `The space_id in the callback URL cannot be mapped to a region. URL: ${url}`,
      }
    }

    const callbackData = await adapter.getCallbackData()
    if (!callbackData) {
      await adapter.removeCallbackData()
      return {
        type: 'error',
        redirectTo: params.errorCallback,
      }
    }

    const { codeVerifier, state, returnTo } = callbackData
    const appSession = await fetchAppSession(params, {
      region,
      codeVerifier,
      state,
      url,
    })

    if (!appSession) {
      await adapter.removeCallbackData()
      return {
        type: 'error',
        redirectTo: params.errorCallback,
      }
    }

    const spaceId = appSession.spaceId.toString()
    const userId = appSession.userId.toString()
    const queryParams: AppSessionQueryParams = {
      space_id: spaceId,
      user_id: userId,
    }
    const redirectTo = appendQueryParams(returnTo, queryParams)

    await adapter.removeCallbackData()
    await adapter.setSession({ spaceId, userId, session: appSession })

    return {
      type: 'success',
      redirectTo,
    }
  } catch (e) {
    await adapter.removeCallbackData()
    return {
      type: 'error',
      message: e instanceof Error ? e.message : 'An unknown error occurred',
      redirectTo: params.errorCallback,
    }
  }
}
