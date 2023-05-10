'use client'
import { useHandler } from '@/data'
import { Dictionary } from '@reduxjs/toolkit'
import {
    createSignalRContext, // SignalR
    createWebSocketContext, // WebSocket
    createSocketIoContext // Socket.io
} from 'react-signalr'

const { useSignalREffect, Provider } = createSignalRContext()

export interface LiveDataContainerProps {
    component: JSX.Element
    onDataReceived?: (data: Dictionary<number>) => void
    onTotalChanged?: (total: number) => void
}

export function LiveDataContainer(props: LiveDataContainerProps) {
    useSignalREffect("ConnectionEstablished", (data) => {

    }, [])
    useSignalREffect("DataReceived", (data) => {
        if (props.onDataReceived) {
            props.onDataReceived(data)
        }
    }, [])
    useSignalREffect("TotalChanged", (data) => {
        if (props.onTotalChanged) {
            props.onTotalChanged(data)
        }
    }, [])
    return <>
        <Provider
            url={process.env.WSAPI_DEV_ENDPOINT ?? "http://localhost:5136/api/v3/wsapi/live-data"}
            connectEnabled={true}
            withCredentials={false}
        >
            {props.component}
        </Provider>
    </>
}