import { InternalAdapter } from '../../../session-adapters/internalAdapter'
import { AuthHandlerParams } from '../../AuthHandlerParams'
import { HandleAuthRequest } from '../HandleAuthRequest'

export const handleUnknownRequest: HandleAuthRequest<{
  params: AuthHandlerParams
  adapter: InternalAdapter
}> = async ({ params, adapter }) => {
  await adapter.removeCallbackData()
  return {
    type: 'error',
    redirectTo: params.errorCallback,
  }
}
