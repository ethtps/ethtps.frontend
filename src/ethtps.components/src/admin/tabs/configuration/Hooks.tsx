import { useCallback } from "react"
import { MicroserviceBadge, ProviderBadge } from "../../badges"
import { IConfigurationStringLinksEditorProps } from "./IConfigurationStringLinksEditorProps"

export function useMicroserviceBadges(props: IConfigurationStringLinksEditorProps) {
    return useCallback(() => <>
        {props.microservices?.map((microservice, index) => MicroserviceBadge({
            microservice: {
                id: index,
                name: microservice.name?.toString() ?? 'unknown'
            },
            onClick: () => props.onClicked?.(microservice),
            key: index,
            selected: props.model.microserviceLinks?.some(x => x.microserviceId === index)
        }))}
        {props.microservices?.length === 0 && <span>No microservices found</span>}
    </>, [props, props.model.microserviceLinks])
}

export const useProviderBadges = (props: IConfigurationStringLinksEditorProps) => useCallback(() => props.providers?.map((provider, index) => ProviderBadge({
    provider: provider,
    key: index,
    onClick: () => props.onProviderClicked?.(provider),
    selected: props.model.providerLinks?.some(x => x.providerId === provider.id),
})) ?? [], [props, props.providers, props.model.providerLinks])