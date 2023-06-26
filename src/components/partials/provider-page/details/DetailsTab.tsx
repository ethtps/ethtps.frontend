import { ProviderLink, ProviderResponseModel } from "@/api-client"
import { ProviderLinks } from "@/components"

interface IDetailsTabProps {
    provider: ProviderResponseModel
    providerLinks?: ProviderLink[]
}

export function DetailsTab(props: Partial<IDetailsTabProps>) {
    return <>
        <ProviderLinks providerLinks={props.providerLinks} provider={props.provider} />
    </>
}