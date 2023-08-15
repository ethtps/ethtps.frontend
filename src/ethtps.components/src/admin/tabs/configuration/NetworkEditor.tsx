import { ETHTPSConfigurationDatabaseEnvironment } from "ethtps.admin.api"
import { useEffect, useState } from "react"
import { useAPI, useAdminAPI, useLoadedObject } from "../experiments"
import { DataGridType, GenericDataGrid } from "../.."


export function NetworkEditor() {
    const api = useAPI()
    const adminAPI = useAdminAPI()
    const data = useLoadedObject(() => api.getAllEnvironmentsAsync())
    const onAddOrUpdate = (data: any) => {
        //return api.(data)
    }

    return (
        <>
            <GenericDataGrid
                data={data?.map((x, i) => ({id:i, name: x}))}
                dataType={DataGridType.Networks} />
        </>
    )
}
