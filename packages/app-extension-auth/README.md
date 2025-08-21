# @storyblok/app-extension-auth

A JavaScript library for managing authentication for [Storyblok](https://www.storyblok.com) apps.

## Migrating v1 to v2

The `@storyblok/app-extension-auth` v1 stored the access token in a cookie. However, in a future version of v2, the library will offer an adapter pattern, allowing you to store the access token elsewhere, such as in a dedicated database. The following breaking changes abstract the code to make this transition easier in the near future:

### `sessionCookieStore` → `getSessionStore`

```js
// from
import { sessionCookieStore } from '@storyblok/app-extension-auth'

// to
import { getSessionStore } from '@storyblok/app-extension-auth'
```

### `getSessionStore`

```js
const sessionStore = getSessionStore(authHandlerParams)({
  req: event.node.req,
  res: event.node.res,
})
```

The `sessionStore` created by `sessionCookieStore` now exposes four methods: `get`, `getAll`, `put`, and `remove`.

- The `getAll` method returns all app sessions, regardless of the spaces that the user has open.
- The `put` and `remove` methods now return a `Promise<boolean>` instead of a `Promise<void>`.

### `AuthHandlerParams`

```js
import { authHandler } from '@storyblok/app-extension-auth'
const params: AuthHandlerParams = {
  // ...
}
authHandler(params)
```

The parameter `AuthHandlerParams['cookieName']` has been renamed to `AuthHandlerParams['sessionKey']`.

## Getting Started

See our starters:

- [Next.js](https://github.com/storyblok/space-tool-plugins/tree/main/space-plugins/nextjs-starter)

### Install the library

Install with:

```shell
# npm
npm install @storyblok/app-extension-auth

#yarn
yarn add @storyblok/app-extension-auth
```

### Set a URL

Decide a URL for your app. As a first step, this should be a URL for local development. For this you will need a secure tunnel, for example [ngrok](https://ngrok.com/).

To open a secure tunnel with ngrok, run:

```shell
ngrok http 3000
```

### Set up an App in Storyblok's Partner Portal

Create an App in Storyblok's Partner Portal. Then open app's settings, navigate to _Oauth 2_, and configure the following values:

- **URL to your app**: the index page of your app. For example, `https://my-app.com/`.

- **OAuth2 callback URL**: the api endpoint that will initiate the OAuth flow.
  - Calculated as: `{baseUrl}/{endpointPrefix}/storyblok/callback`
  - Example value: `https://my-app.com/api/connect/storyblok/callback`

Substitute `{baseUrl}` and `{endpointPrefix}` for your own values. These parameters will be referenced again in your code; see the next section.

### Define constants

In your source code, create the following object (you will need it later):

```typescript
import { AuthHandlerParams } from '@storyblok/app-extension-auth'

export const params: AuthHandlerParams = {
  clientId: process.env.APP_CLIENT_ID,
  clientSecret: process.env.APP_CLIENT_SECRET,
  baseUrl: process.env.APP_URL,
  successCallback: '/',
  errorCallback: '/401',
  endpointPrefix: '/api/connect',
}
```

Some variables should be loaded via environmental variables (`.env.local`):

- `clientId` -- The client ID is a public identifier for your apps. Find the Client ID in the app settings on Storyblok.
- `clientSecret` -- The client secret is a secret known only to the application and the authorization server. Find the client secret in the app settings on Storyblok.
  Load it into the application as an environmental variable.
  It must be kept confidential.
- `baseUrl` -- The base URL specifies the base URL to use for all relative authentication API endpoints created by authHandler().
  The base URL must be absolute and secure with https.

  For example, the base URL `https://my-app.my-domain.com/` will create the following api endpoints:

  - `https://my-app.my-domain.com/storyblok` for initiating the authentication flow
  - `https://my-app.my-domain.com/storyblok/callback` as the OAuth2 callback URL

The other variables can be hard-coded:

- `successCallback` -- Specifies the URL that the user agent will be redirected to after a _successful_ authentication flow. Defaults to `"/"`.
- `errorCallback` -- Specifies the URL that the user agent will be redirected to after an _unsuccessful_ authentication flow. If omitted, the user agent will receive a 401 response without redirect.
- `endpointPrefix` -- Specifies the partial URL that is located between the baseUrl and the
  authentication API endpoints.

  For example, the following two properties

  - `baseUrl: "https://my-app.my-domain.com/"`
  - `endpointPrefix: "api/authenticate"`

  will result in the API endpoints

  - `https://my-app.my-domain.com/api/authenticate/storyblok` for initiating the authentication flow
  - `https://my-app.my-domain.com/api/authenticate/storyblok/callback` as the OAuth2 callback URL

### Create an API route

In NodeJS, create a dynamic route that handles the incoming requests with `authHandler()`. See [Framework examples](#routing-for-various-frameworks).

For example, in Next.js, create a file `pages/api/connect/[...slugs].ts`:

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

export default authHandler(params)
```

### Sign in

Sign in a user by redirecting to the api route: `/api/connect/storyblok`

This will initiate the oauth flow and redirect the user to the url specified in the `successCallback` URL. The following query parameters will be appended to the `successCallback` URL:

- `userId`
- `spaceId`

### Retrieve the session

Now, use these two query parameters to retrieve the session object:

```typescript
import { sessionCookieStore } from '@storyblok/app-extension-auth'

const sessionStore = sessionCookieStore(params)(context)
const appSession = await sessionStore.get(query)

if (appSession === undefined) {
  // The user is not authenticated
  //  redirect to /api/connect/storyblok
}
```

### Use the session

The `AppSession` object contain user information for personalized content, and an access token to the Storyblok management API.

```typescript
const { userId, spaceId, region, roles, accessToken } = appSession
```

### Routing

Storyblok apps are embedded within Storyblok via iframes. When a page is requested, the server must get to know

1. `spaceId`: the space the page is being embedded within
2. `userId`: the user who loaded the page

These two values needs to be encoded within the page request.

If these two values cannot be retrieved, you need to initiate the OAuth flow by redirecting the user agent to `/api/connect/storyblok`. After a successful authentication, the `spaceId` and `userId` will be added as query parameters to the `successCallback` value. Now, it should be possible to retrieve the session like so

```typescript
import { sessionCookieStore } from '@storyblok/app-extension-auth'

const sessionStore = sessionCookieStore(params)(context)
const appSession = await sessionStore.get(query)
```

When you redirect the user agent to a new page within your application, you need to _append the `spaceId` and `userId` query parameters_. Only if you do this can you retrieve the session from the `sessionCookieStore` from the other route.

```typescript
const href = `/my/other/page?spaceId=${spaceId}&userId=${userId}`
```

## How to run this application locally

To run OAuth locally, pass the `storyblokApiBaseUrl` property to the params object when calling the `authHandler` function in the target project (i.e. the plugin or application you want to test). With this parameter, you can change the target's backend environment.

```typescript
import { AuthHandlerParams } from '@storyblok/app-extension-auth'

import { authHandler } from '@storyblok/app-extension-auth'
const params: AuthHandlerParams = {
  // ...
  storyblokApiBaseUrl: 'http://localhost:1234',
}
authHandler(params)
```

## Routing for various frameworks

### Next.js

In Next.js, create a file `pages/api/connect/[...slugs].ts`

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

export default authHandler(params)
```

### Express

In ExpressJs, create a route

```typescript
import { authHandler } from '@storyblok/app-extension-auth'

app.all('/api/connect/*', authHandler(params))
```

## Useful Resources

- [Authentication Oauth2 flow](https://www.storyblok.com/docs/plugins/authentication-apps)
- [Custom Applications](https://www.storyblok.com/docs/plugins/custom-application)
