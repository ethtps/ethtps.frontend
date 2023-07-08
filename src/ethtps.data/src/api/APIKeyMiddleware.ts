import { FetchParams, Middleware, RequestContext } from 'ethtps.api'

const _apiKeyHeaderName = 'X-API-Key'

export class APIKeyMiddleware implements Middleware {
	constructor(private _apiKey: string) { }

	public pre = (context: RequestContext): Promise<FetchParams | void> => {
		context.init.headers = {
			...context.init.headers,
			'X-API-Key': (typeof window === 'undefined') ? process.env.REACT_APP_FRONTEND_API_KEY ?? '' : this._apiKey,
		}
		return Promise.resolve(context)
	}
}
