import { Middleware } from 'redux'
import { WebsocketEvent, websocketActions } from './WebsocketSubscriptionSlice'
import websocketSlice from './WebsocketSubscriptionSlice'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { setLiveData } from './LiveDataSlice'
import { useAppSelector } from '../store'
import { useState, useEffect } from 'react'
import {
	reconnect,
	rws,
	setReconnect,
	setRWS,
} from '../models/services/DependenciesIOC'
import { InstantDataResponseModel } from '../common-types/Dictionaries'

const websocketMiddleware: Middleware = (store) => (next) => (action) => {
	if (!websocketActions.connecting.match(action)) {
		return next(action)
	}
	return next(action)
	if (reconnect && useAppSelector((state) => state.websockets.wsURL)) {
		setReconnect(false) //Only needs to be done once
		setRWS(
			new ReconnectingWebSocket(
				useAppSelector((state) => state.websockets.wsURL) ?? ''
			)
		)
		useAppDispatch(websocketActions.connecting())

		rws.addEventListener('open', () => {
			useAppDispatch(websocketActions.connected())
		})

		rws.addEventListener('close', () => {
			useAppDispatch(websocketActions.disconnected())
			useAppDispatch(websocketActions.connecting())
		})

		rws.addEventListener('message', (e) => {
			try {
				let obj = JSON.parse(e.data)
				let type: string = obj.Type ?? 'unknown'
				switch (type) {
					case WebsocketEvent.LiveDataReceived:
						useAppDispatch(
							setLiveData(obj.Data as InstantDataResponseModel)
						)
						break
					case WebsocketEvent.KeepAlive:
						rws.send('ack')
						break
					default:
						console.log(`Unhandled event of type "${type}"`)
						break
				}
			} catch (e) {
				console.log('WS Error: ' + e)
			}
		})
	}
	next(action)
}

export default websocketMiddleware
