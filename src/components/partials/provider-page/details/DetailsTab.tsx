import { ProviderResponseModel } from "@/api-client"
import { ProviderLinks } from "@/components"

interface IDetailsTabProps {
    provider: ProviderResponseModel
}

export function DetailsTab(props: Partial<IDetailsTabProps>) {
    return <>
        <ProviderLinks provider={props.provider} />
    </>
}