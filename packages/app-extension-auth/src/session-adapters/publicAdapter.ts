import { IncomingMessage, ServerResponse } from 'node:http'
import { AppSession } from '../session'

export type MaybePromise<T> = T | Promise<T>

// eslint-disable-next-line functional/no-mixed-types
export type Adapter = {
  getSession: GetSession
  getAllSessions?: GetAllSessions
  setSession: SetSession
  removeSession: RemoveSession
  hasSession: HasSession
}

type BaseSessionParams = {
  req: IncomingMessage
  res: ServerResponse
  clientId: string
  spaceId: string
  userId: string
}

type GetSession = (
  params: BaseSessionParams,
) => MaybePromise<AppSession | undefined>

type GetAllSessions = (
  params: Pick<BaseSessionParams, 'req'>,
) => MaybePromise<AppSession[]>

type SetSession = (
  params: BaseSessionParams & {
    session: AppSession
  },
) => MaybePromise<boolean>

type RemoveSession = (params: BaseSessionParams) => MaybePromise<boolean>

type HasSession = (params: BaseSessionParams) => MaybePromise<boolean>
