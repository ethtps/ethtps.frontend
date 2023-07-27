'use client'
import { useEffect } from 'react'
import { createSignalRContext } from 'react-signalr'
import { GenericDictionary, L2DataUpdateModel } from '../../../ethtps.data/src'
const { useSignalREffect, Provider } = createSignalRContext({
	shareConnectionBetweenTab: true,
})

export interface LiveDataContainerProps {
	children?: React.ReactNode
	onDataReceived?: (data: GenericDictionary<L2DataUpdateModel>) => void
	onTotalChanged?: (total: number) => void
	onConnected?: () => void
	onDisconnected?: () => void
	onError?: (error: any) => void
}

export function LiveDataContainer(props: LiveDataContainerProps): JSX.Element {
	try {
		useSignalREffect(
			'ConnectionEstablished',
			(data) => {
				if (props.onConnected) {
					props.onConnected()
				}
			},
			[]
		)
		useSignalREffect(
			'LiveDataChanged',
			(data) => {
				if (props.onDataReceived) {
					props.onDataReceived(data)
				}
			},
			[]
		)
		useSignalREffect(
			'TotalChanged',
			(data) => {
				//console.log("TotalChanged")
				if (props.onTotalChanged) {
					props.onTotalChanged(data)
				}
			},
			[]
		)
	}
	catch (e) {
		console.error(e)
	}
	return (
		<>
			<Provider
				url={
					process.env.WSAPI_DEV_ENDPOINT ??
					'http://localhost:5136/api/v3/wsapi/live-data'
				}
				connectEnabled={true}
				withCredentials={false}>
				{props.children}
			</Provider>
		</>
	)
}
