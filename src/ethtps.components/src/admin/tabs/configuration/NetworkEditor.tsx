import { ETHTPSConfigurationDatabaseEnvironment } from "ethtps.admin.api"
import { useEffect, useState } from "react"
import { useAPI } from "../experiments"


export function NetworkEditor() {
    const api = useAPI()
    const [data, setData] = useState<ETHTPSConfigurationDatabaseEnvironment[]>()
    useEffect(() => {
        api.getAllNetworksAsync().then(res => {
            setData(res.map((x, i) => ({ id: i, name: x })))
        })
    }, [api])
    const onAddOrUpdate = (data: any) => {
        //return api.addOrUpdateEnvironment(data)
    }

    return (
        <>Grid</>
    )
}
