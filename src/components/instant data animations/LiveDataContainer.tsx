import {
    createSignalRContext, // SignalR
    createWebSocketContext, // WebSocket
    createSocketIoContext, // Socket.io
} from "react-signalr";

const SignalRContext = createSignalRContext();

export function LiveDataContainer(props: { component: JSX.Element }) {
    return <>
        <SignalRContext.Provider
            url={process.env.WSAPI_DEV_ENDPOINT ?? "http://localhost:5136/api/v3/wsapi/live-data"}
        >
            {props.component}
        </SignalRContext.Provider>
    </>
}