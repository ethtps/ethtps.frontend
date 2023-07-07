interface HttpResponse<T> extends Response {
	parsedBody?: T
}
async function httpAsync<T>(request: RequestInfo): Promise<HttpResponse<T>> {
	const response: HttpResponse<T> = await fetch(request)
	try {
		response.parsedBody = await response.json()
	} catch (e) {
		console.error(e, response, request)
	}
	return response
}

export async function getStringAsync(request: RequestInfo): Promise<string> {
	const response: HttpResponse<string> = await fetch(request)
	return response.text()
}

export async function getAsync<T>(
	path: string,
	args: RequestInit = { method: 'GET' }
): Promise<HttpResponse<T>> {
	return await httpAsync<T>(new Request(path, args))
}

export async function postAsync<T>(
	path: string,
	body: any,
	args: RequestInit = { method: 'POST', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
	return await httpAsync<T>(new Request(path, args))
}

export async function putAsync<T>(
	path: string,
	body: any,
	args: RequestInit = { method: 'PUT', body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
	return await httpAsync<T>(new Request(path, args))
}
