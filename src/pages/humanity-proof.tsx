import { RecaptchaTokenLoader, useQueryStringAndLocalStorageBoundState } from "../ethtps.components"
import { createHandlerFromCallback } from "../ethtps.data"

export default function HumanityProof() {

    const [key, setKey] = useQueryStringAndLocalStorageBoundState<string | undefined>(undefined, 'apiKey')
    const keyHandler = createHandlerFromCallback((key?: string) => {
        setKey(key)
    })
    const humanHandler /* */ = createHandlerFromCallback((isHuman?: boolean) => {
        setKey(key)
    })

    return <>
        <RecaptchaTokenLoader onKeyLoaded={keyHandler} onIsHuman={humanHandler} />
    </>
}