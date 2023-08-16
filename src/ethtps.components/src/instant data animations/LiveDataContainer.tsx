'use client'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createSignalRContext } from 'react-signalr'
import { DEBUG, GenericDictionary, L2DataUpdateModel } from '../../../ethtps.data/src'

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
	const router = useRouter()
	const [connectEnabled, setConnectEnabled] = useState(true)

	// Handle route changes
	useEffect(() => {
		const handleRouteChange = () => {
			if (!connectEnabled) return
			if (DEBUG) {
				console.debug('Disconnecting SignalR...')
			}
			setConnectEnabled(false)
		}

		router.events.on('routeChangeStart', handleRouteChange)

		// Cleanup
		return () => {
			router.events.off('routeChangeStart', handleRouteChange)
		}
	}, [connectEnabled, router])

	useSignalREffect(
		'ConnectionEstablished',
		(data) => {
			props.onConnected?.()
		},
		[]
	)

	useSignalREffect(
		'LiveDataChanged',
		(data) => {
			props.onDataReceived?.(data)
		},
		[]
	)

	useSignalREffect(
		'TotalChanged',
		(data) => {
			props.onTotalChanged?.(data)
		},
		[]
	)

	return (
		<Provider
			url={
				process.env.WSAPI_DEV_ENDPOINT ??
				'http://localhost:5136/api/v3/wsapi/live-data'
			}
			connectEnabled={connectEnabled}
			withCredentials={false}
		>
			{props.children}
		</Provider>
	)
}
