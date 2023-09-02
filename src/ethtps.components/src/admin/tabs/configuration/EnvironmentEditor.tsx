
import { ETHTPSConfigurationDatabaseEnvironment } from "ethtps.admin.api"
import { useContext, useEffect, useState } from "react"
import { APIContext, DataGridType, GenericDataGrid, useLoadedObject } from "../../../.."

export function EnvironmentEditor() {
    const api = useContext(APIContext)
    const data = useLoadedObject(()=> api.getAllEnvironmentsAsync())
    const onAddOrUpdate = (data: any) => {
        //return AdminAPI.addOrUpdateEnvironment(data)
    }

    return (
        <>
            <GenericDataGrid
                data={data?.map((x, i) => ({ id: i, name: x }))}
                dataType={DataGridType.Environments} />
        </>
    )
}
