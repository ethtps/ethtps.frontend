"use client"
import { useHandler } from "@/data/src";
import {
    createSignalRContext, // SignalR
    createWebSocketContext, // WebSocket
    createSocketIoContext, // Socket.io
} from "react-signalr";
/*
const { useSignalREffect, Provider } = createSignalRContext()

export function LiveDataContainer(props: { component: JSX.Element }) {
    useSignalREffect("ConnectionEstablished", (data) => {
        console.log({ connectionEstablished: data })
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
}*/