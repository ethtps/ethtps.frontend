import { ETHTPSDataIntegrationsMSSQLProvider } from 'ethtps.admin.api'


interface ProviderEditorProps {
    providers?: Array<ETHTPSDataIntegrationsMSSQLProvider>
    onEdit?: (provider: ETHTPSDataIntegrationsMSSQLProvider) => void
}

export function ProviderEditor(props: ProviderEditorProps) {
    const handleEdit = (provider: ETHTPSDataIntegrationsMSSQLProvider) => {
        if (props.onEdit) {
            props.onEdit(provider)
        }
    }

    return (
        <div>
            Generic grid
        </div>
    )
}
