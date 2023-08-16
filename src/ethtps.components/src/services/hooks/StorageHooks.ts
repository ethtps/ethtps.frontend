/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from 'react'

export function useQueryStringAndLocalStorageBoundState<T>(
	initialState: T,
	paramName: string
): [T | undefined, (newValue: T) => void] {
	const [state, setState] = useState<T | undefined>(undefined)
	try {

		useEffect(() => {
			// If window is not defined (e.g., on server-side), use initialState.
			if (typeof window === 'undefined') {
				setState(initialState)
				return
			}

			// Get initial value from query string or local storage, falling back to provided initial state.
			const params = new URLSearchParams(window.location.search)
			const paramValue = params.get(paramName)
			let value: T = initialState

			if (paramValue !== null) {
				value = JSON.parse(paramValue)
			} else {
				const storedValue = localStorage.getItem(paramName)
				if (storedValue !== null) {
					value = JSON.parse(storedValue)
				}
			}

			setState(value)
		}, [paramName, initialState])

		useEffect(() => {
			if (typeof window === 'undefined' || state === undefined) {
				return
			}

			// Sync state with local storage and query string whenever it changes.
			localStorage.setItem(paramName, JSON.stringify(state))

			const params = new URLSearchParams(window.location.search)
			params.set(paramName, JSON.stringify(state))
			window.history.replaceState(null, '', '?' + params.toString())
		}, [state, paramName])
	}
	catch (err) {
		console.log(err)
	}
	return [state, setState]
}
