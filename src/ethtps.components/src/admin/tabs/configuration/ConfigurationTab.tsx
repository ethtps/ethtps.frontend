
import { Box } from "@chakra-ui/react"
import { ETHTPSDataIntegrationsMSSQLProvider } from "ethtps.api"
import { useContext, useEffect, useState } from "react"
import { APIContext } from "../../../"
import { CustomGenericTabPanel } from "../../../.."
import { ProviderEditor } from "../providers/ProviderEditor"
import { EnvironmentEditor } from "./EnvironmentEditor"
import { NetworkEditor } from "./NetworkEditor"
import { ProviderLinksTab } from "./links/ProviderLinksTab"
import { ConfigurationEditor } from "./string editor"
import { WebsitesTab } from "./websites/WebsitesTab"

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

export function ConfigurationTab() {
    const api = useContext(APIContext)
    const [providers, setProviders] = useState<Array<ETHTPSDataIntegrationsMSSQLProvider>>()

    useEffect(() => {
        api.getAllProvidersAsync().then((response) => {
            setProviders(response)
        })
    }, [api])

    return <>
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignContent={'center'}>
            <CustomGenericTabPanel
                items={[
                    { title: 'Providers', content: <ProviderEditor providers={providers} /> },
                    { title: 'Strings', content: <ConfigurationEditor /> },
                    { title: 'Environments', content: <EnvironmentEditor /> },
                    { title: 'Networks', content: <NetworkEditor /> },
                    { title: 'Websites', content: <WebsitesTab /> },
                    { title: 'Provider links', content: <ProviderLinksTab /> }
                ]}
                localStorageKey={'conftab'} />
        </Box>
    </>
}