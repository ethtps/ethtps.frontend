'use client'
import { L2DataUpdateModel } from '@/data'
import { Dictionary } from '@reduxjs/toolkit'
import {
    createSignalRContext
} from 'react-signalr'

const { useSignalREffect, Provider } = createSignalRContext()

export interface LiveDataContainerProps {
    component: JSX.Element
    onDataReceived?: (data: Dictionary<L2DataUpdateModel>) => void
    onTotalChanged?: (total: number) => void
    onConnected?: () => void
    onDisconnected?: () => void
    onError?: (error: any) => void
}

export function LiveDataContainer(props: LiveDataContainerProps) {
    useSignalREffect("ConnectionEstablished", (data) => {
        if (props.onConnected) {
            props.onConnected()
        }
    }, [])
    useSignalREffect("LiveDataChanged", (data) => {
        if (props.onDataReceived) {
            props.onDataReceived(data)
        }
    }, [])
    useSignalREffect("TotalChanged", (data) => {
        //console.log("TotalChanged")
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