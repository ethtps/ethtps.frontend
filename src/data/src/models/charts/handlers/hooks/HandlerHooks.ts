/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import { type IHandler } from '../IHandler'
import { type IOptionalCallback } from '../IOptionalCallback'

export function createHandlerFromCallback<TReturnValue>(
	callback: (newValue?: TReturnValue) => void
): Handler<TReturnValue> | undefined {
	return createHandlerFromType<TReturnValue>({ callback })
}

export function useHandler<TReturnValue>(
	handler?: IHandler<TReturnValue>
): Handler<TReturnValue> | undefined {
	if (handler == null) return undefined

	return React.useCallback(
		() => createHandlerFromType<TReturnValue>(handler),
		[handler]
	)()
}

function createHandlerFromType<TReturnValue>(
	handler?: IHandler<TReturnValue>
): Handler<TReturnValue> {
	return createHandler<IHandler<TReturnValue>, TReturnValue>(handler)
}
function createHandler<THandler extends IHandler<TReturnValue>, TReturnValue>(
	handler?: THandler
): Handler<TReturnValue> {
	if (handler == null) {
		return new Handler<TReturnValue>((newValue?: TReturnValue) => { })
	}

	const [value, setValue] = React.useState<TReturnValue | undefined>(
		handler.defaultValue
	)
	const setter = (newValue?: TReturnValue): void => {
		setValue(newValue)
		handler.callback?.(newValue as TReturnValue)
	}
	return new Handler<TReturnValue>(setter, value)
}

export class Handler<TReturnValue> implements IOptionalCallback<TReturnValue> {
	constructor(
		public setter: (newValue: TReturnValue) => void = (
			newValue: TReturnValue
		) => {
			this.value = newValue
			if (this.callback != null) this.callback(newValue)
		},
		public value?: TReturnValue | undefined
	) { }

	private convertToIHandler(): IHandler<TReturnValue> {
		return {
			defaultValue: this.value,
		}
	}

	public readonly callback?: (value: TReturnValue) => void =
		this.convertToIHandler().callback
}
