
import { ETHTPSConfigurationDatabaseEnvironment } from "ethtps.admin.api"
import { useContext, useEffect, useState } from "react"
import { APIContext } from "../../../.."



export function EnvironmentEditor() {
    const api = useContext(APIContext)
    const [data, setData] = useState<ETHTPSConfigurationDatabaseEnvironment[]>()
    useEffect(() => {
        api.getAllEnvironmentsAsync().then(res => {
            setData(res.map((x, i) => ({ id: i, name: x })))
        })
    }, [api])
    const onAddOrUpdate = (data: any) => {
        //return AdminAPI.addOrUpdateEnvironment(data)
    }

    return (
        <>Grid</>
    )
}
