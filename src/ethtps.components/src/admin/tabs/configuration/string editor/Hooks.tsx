import { Alert, Text, Tooltip } from '@chakra-ui/react'
import { ETHTPSConfigurationConfigurationStringLinksModel, ETHTPSConfigurationDatabaseAllConfigurationStringsModel, ETHTPSDataIntegrationsMSSQLProvider } from 'ethtps.admin.api'
import { useCallback } from 'react'
import { useAPI } from '../../experiments'

export type Hook<T> = [T | undefined, React.Dispatch<React.SetStateAction<T | undefined>>]
export type DefinedHook<T> = [T, React.Dispatch<React.SetStateAction<T>>]

export function useProviderHandler([allLinks, setAllLinks]: Hook<ETHTPSConfigurationConfigurationStringLinksModel>, [selected, setSelected]: Hook<ETHTPSConfigurationDatabaseAllConfigurationStringsModel>, [providerSaveResult, setProviderSaveResult]: Hook<JSX.Element>) {
    const api = useAPI()
    return useCallback((provider: ETHTPSDataIntegrationsMSSQLProvider) => {
        const links = allLinks?.providerLinks?.filter(x => x.providerId === provider.id && x.configurationStringId === selected?.id)
        console.log(links)
        const method = (links && links.length > 0) ? api.unlinkStringFromProviderByIDAsync : api.linkStringToProviderByIDAsync
        if (selected?.id && provider?.id) {
            setProviderSaveResult(<Alert security="info" > <Text>Saving changes...</Text></Alert >)
            method(selected.id, provider.id).then(res => {
                setAllLinks(prev => {
                    setProviderSaveResult(<Alert security="info" > <Text>Rows changed: {res} </Text></Alert >)
                    if (prev) {
                        if (!links || links.length === 0) {
                            prev.providerLinks?.push({
                                id: -1,
                                providerId: provider.id,
                                configurationStringId: selected.id,
                                environmentId: -1,
                            })
                        }
                        else {
                            prev.providerLinks = prev?.providerLinks?.filter(x => x.providerId !== provider.id && x.configurationStringId === selected.id)
                        }
                        return { ...prev }
                    }
                    else {
                        return {
                            configurationString: selected,
                            providerLinks: [{
                                id: -1,
                                providerId: provider.id,
                                configurationStringId: selected.id,
                                environmentId: -1,
                            }],
                        }
                    }
                })
            }).catch(err => {
                setProviderSaveResult(<>
                    <Tooltip title={err.cause}>
                        <Alert security="error" > {err.message} </Alert>
                    </Tooltip>
                </>)
            })
        }
    }, [allLinks, selected, api.linkStringToProviderByIDAsync, api.unlinkStringFromProviderByIDAsync, setAllLinks, setProviderSaveResult])
}