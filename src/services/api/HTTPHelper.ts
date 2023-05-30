interface HttpResponse<T> extends Response {
    parsedBody?: T
}
async function httpAsync<T>(
    request: RequestInfo
): Promise<HttpResponse<T>> {
    const response: HttpResponse<T> = await fetch(
        request
    )
    response.parsedBody = await response.json()
    return response
}

export async function getStringAsync(request: RequestInfo): Promise<string> {
    const response: HttpResponse<string> = await fetch(request)
    return response.text()
}

export async function getAsync<T>(
    path: string,
    args: RequestInit = { method: "get" }
): Promise<HttpResponse<T>> {
    return await httpAsync<T>(new Request(path, args))
};

export async function postAsync<T>(
    path: string,
    body: any,
    args: RequestInit = { method: "post", body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await httpAsync<T>(new Request(path, args))
};

export async function putAsync<T>(
    path: string,
    body: any,
    args: RequestInit = { method: "put", body: JSON.stringify(body) }
): Promise<HttpResponse<T>> {
    return await httpAsync<T>(new Request(path, args))
};
