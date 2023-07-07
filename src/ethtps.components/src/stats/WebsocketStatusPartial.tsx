import { IconPlugConnected, IconPlugConnectedX } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { Text } from '@chakra-ui/react'
export function WebsocketStatusPartial() {
	const [connected, setConnected] = useState(false)
	const status = false //useAppSelector((state) => state.websockets.isConnected)
	useEffect(() => {
		setConnected(status)
	}, [status])
	return (
		<>
			<div
				style={{
					position: 'absolute',
					cursor: 'default',
					marginLeft: '1em',
					marginTop: '1em',
				}}
				className={connected ? 'disappear box' : 'appear box'}>
				{connected ? (
					<IconPlugConnected
						color={connected ? 'primary' : 'error'}
					/>
				) : (
					<IconPlugConnectedX
						color={connected ? 'primary' : 'error'}
					/>
				)}
				<Text
					color={connected ? 'primary' : 'error'}
					className="inline">
					{connected ? 'Connected' : 'Disconnected'}
				</Text>
			</div>
		</>
	)
}
