const maybeStorage: Storage | null =
	typeof window !== 'undefined' ? window.localStorage : null
export { maybeStorage }
