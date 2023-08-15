import { ETHTPSDataIntegrationsMSSQLProvider } from 'ethtps.admin.api'

import DataGrid from 'react-data-grid'

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

    return !!props.providers && (
        <DataGrid columns={[
            { key: 'id', name: 'ID' },
        ]} rows={props.providers} />
    )
}
