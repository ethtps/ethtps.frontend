import { Alert, Container, Divider, Text } from "@chakra-ui/react"
import { ETHTPSDataIntegrationsMSSQLExternalWebsite } from "ethtps.admin.api"
import { useEffect, useState } from "react"
import { useExternalWebsiteCategories, useExternalWebsites } from "./Hooks"
import { DataGridType, GenericDataGrid } from "../../.."

export function WebsitesTab() {
    const categories = useExternalWebsiteCategories()
    const [selectedWebsite, setSelectedWebsite] = useState<ETHTPSDataIntegrationsMSSQLExternalWebsite | undefined>()
    const [websites, setWebsites] = useState<ETHTPSDataIntegrationsMSSQLExternalWebsite[] | undefined>()
    const loadedWebsites = useExternalWebsites()
    useEffect(() => {
        setWebsites(loadedWebsites)
    }, [loadedWebsites])
    return <>
        <Container>
            <Divider sx={{
                marginTop: '1rem',
                opacity: 0
            }} />
            <Text >
                External websites
            </Text>
            <Text >
                External websites are links that appear in network detail pages
            </Text>
            <Divider sx={{
                marginTop: '1rem',
                opacity: 0
            }} />
            <Text >
                Categories
            </Text>
            <Divider sx={{
                marginTop: '1rem',
                opacity: 0
            }} />
            <Alert security="info">
                <Text>You can manage external website categories here.</Text>
            </Alert>
            <>Grid</>
        </Container>
        <Divider sx={{
            marginTop: '1rem',
            opacity: 0
        }} />
        <Container>
            <Divider sx={{
                marginTop: '1rem',
                opacity: 0
            }} />
            <Text >
                Websites
            </Text>
            <Divider sx={{
                marginTop: '1rem',
                opacity: 0
            }} />
            <Alert security="info">
                <Text>You can manage external websites here.</Text>
            </Alert>

            <GenericDataGrid<ETHTPSDataIntegrationsMSSQLExternalWebsite>
                data={websites}
                dataType={DataGridType.Environments} />
        </Container>
    </>
}