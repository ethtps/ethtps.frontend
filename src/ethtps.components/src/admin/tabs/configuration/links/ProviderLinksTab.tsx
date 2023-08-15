import { Alert, Container, Text } from "@chakra-ui/react"
import { ETHTPSDataIntegrationsMSSQLProviderLink } from "ethtps.admin.api"
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from "ethtps.api"
import { useEffect, useState } from "react"
import { useAPI, useLoadedObject } from "../../experiments"
import { ProviderLinksEditor } from "./ProviderLinksEditor"

interface IProviderLinksTabProps {
    providers: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
}

export function ProviderLinksTab(props: Partial<IProviderLinksTabProps>) {
    const api = useAPI()
    const [providerLinks, setProviderLinks] = useState<ETHTPSDataIntegrationsMSSQLProviderLink[] | undefined>()
    const loadedLinks = useLoadedObject(() => api.getAllProviderLinksAsync())
    useEffect(() => {
        setProviderLinks(loadedLinks)
    }, [loadedLinks])
    return <>
        <Container>
            <Alert security="info">
                <Text>You can manage provider links here.</Text>
            </Alert>
            <ProviderLinksEditor
                onAdded={(e, id) => {
                    setProviderLinks([...providerLinks || [], {
                        id: Math.random() * 100000,
                        providerId: id,
                        link: e
                    }])
                }}
                providers={props.providers} />
        </Container>
        <Container>
            <Text >
                All provider links
            </Text>
            <>Grid</>
        </Container>
    </>
}