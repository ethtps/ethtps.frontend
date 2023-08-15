import { Alert, Box, Container, Divider, Tooltip } from "@chakra-ui/react"
import { ETHTPSConfigurationConfigurationStringLinksModel, ETHTPSConfigurationDatabaseAllConfigurationStringsModel, ETHTPSConfigurationDatabaseEnvironment, ETHTPSConfigurationIMicroservice, ETHTPSDataIntegrationsMSSQLProvider } from "ethtps.admin.api"
import { useEffect, useState } from "react"
import { useAPI, useAdminAPI, useETHTPSAPIs } from "../.."
import { ConfigurationStringLinksEditor } from "./ConfigurationStringLinksEditor"
import { useProviderHandler } from "./Hooks"
import DataGrid from 'react-data-grid'
import { GenericDataGrid } from "../../../data-grid"
import { DataGridType } from "../../utils/data-grid"

const getRow = (d: ETHTPSConfigurationDatabaseAllConfigurationStringsModel | undefined,
    index: number) => {

}

export function ConfigurationEditor() {
    const { api, adminAPI} =useETHTPSAPIs()
    const [saving, setSaving] = useState<boolean>(false)
    const [saveResult, setSaveResult] = useState<JSX.Element>()
    const [providers, setProviders] = useState<ETHTPSDataIntegrationsMSSQLProvider[]>()
    const [microservices, setMicroservices] = useState<ETHTPSConfigurationIMicroservice[]>()
    const [allEnvironments, setAllEnvironments] = useState<ETHTPSConfigurationDatabaseEnvironment[]>()
    const [allLinks, setAllLinks] = useState<ETHTPSConfigurationConfigurationStringLinksModel>()
    const [selected, setSelected] = useState<ETHTPSConfigurationDatabaseAllConfigurationStringsModel>()
    const [configurationData, setConfigurationData] = useState<ETHTPSConfigurationDatabaseAllConfigurationStringsModel[]>()
    const [providerSaveResult, setProviderSaveResult] = useState<JSX.Element>()
    useEffect(() => {
        api.getAllStringsAsync().then(res => {
            setConfigurationData(res)
        })
        api.getAllEnvironmentsAsync().then(res => {
            setAllEnvironments(res?.map((x, i) => { return { id: i, name: x } }))
        }
        )
    }, [api])

    const addOrUpdateString = (data: ETHTPSConfigurationDatabaseAllConfigurationStringsModel) => {
        setSaving(true)
        return api.addOrUpdateStringAsync(data)
            .then(res => {
                setSaveResult(<Alert security="success">Saved!</Alert>)
                setConfigurationData(prev => {
                    const index = prev?.findIndex(x => x.id === selected?.id)
                    if (index === -1) {
                        return [...prev ?? [], data]
                    }
                    prev ??= []
                    if (prev.length === 0) {
                        prev.push(data)
                    }
                    else {
                        prev[index ?? 0] = data
                    }
                    return [...prev]
                })
            }).catch(err => {
                setSaveResult(<>
                    <Tooltip title={err.cause}>
                        <Alert security="error">{err.message}</Alert>
                    </Tooltip>
                </>)
            }).finally(() => setSaving(false))
    }
    useEffect(() => {
        if (selected?.id) {
            setSaveResult(undefined)
            api.getAllConfigurationStringLinksForAsync(selected?.id).then(res => {
                setAllLinks(res)
            })
        }
    }, [selected, api])
    useEffect(() => {
        api.getAllProvidersAsync().then(res => {
            setProviders(res)
        })
    }, [api])

    useEffect(() => {
        api.getAllMicroservicesAsync().then(res => {
            setMicroservices(res)
        })
    }, [api])

    const onMicroserviceClicked = (microservice: ETHTPSConfigurationIMicroservice) => {

    }

    const onProviderClicked = useProviderHandler([allLinks, setAllLinks], [selected, setSelected], [providerSaveResult, setProviderSaveResult])

    return <>
        <Alert security="info">
            Configuration strings can be managed here. {`${!allLinks ? 'Click on an item in the table below to edit it.' : ''}`}
        </Alert>
        <Divider sx={{
            marginTop: '1rem',
            marginBottom: '1rem'
        }} />
        <Divider />
        <Container>
            <ConfigurationStringLinksEditor
                saving={saving}
                microservices={microservices}
                saveResult={saveResult}
                providerSaveResult={providerSaveResult}
                environments={allEnvironments}
                onClicked={onMicroserviceClicked}
                onProviderClicked={onProviderClicked}
                onSave={(data) => addOrUpdateString({
                    id: data.id,
                    name: data.name,
                    value: data.value,
                    isEncrypted: data.isEncrypted ?? false,
                    isSecret: data.isSecret ?? false
                })}
                model={allLinks ?? {}}
                providers={providers} />
        </Container>
        <Divider />
        <Box overflow={'scroll'}>
            {!!configurationData &&
                <GenericDataGrid<ETHTPSConfigurationDatabaseAllConfigurationStringsModel>
                    dataType={DataGridType.Strings}
                    data={configurationData}
                />}
        </Box>
    </>
}