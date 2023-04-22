import { FetchParams, Middleware, RequestContext } from '@/api-client'

const _apiKeyHeaderName = 'X-API-Key'

export class APIKeyMiddleware implements Middleware {
  public pre = (context: RequestContext): Promise<FetchParams | void> => {
    context.url =
      context.url +
      (!context.url.includes('?') ? '?' : '') +
      '&XAPIKEY=' +
      (process.env.REACT_APP_FRONTEND_API_KEY ?? 'rXRBBrUKkW3WAWLqAsO6lCVJUbOBM8Dntc9BIJRYo6dGwRpSkyGiSpX3OxDhLFKW')
    return Promise.resolve(context)
  }
}
//type HeadersInit = [string, string][] | Record<string, string> | Headers;
