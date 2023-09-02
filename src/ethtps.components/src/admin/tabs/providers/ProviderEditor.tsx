import { ETHTPSDataIntegrationsMSSQLProvider } from 'ethtps.admin.api'

import DataGrid from 'react-data-grid'
import { DataGridType, getColumns } from '../utils/data-grid/DataGridUtils'
import { useMemo } from 'react'
import { getFormatter } from '../utils/data-grid/DataGridFormatters'
import { GenericDataGrid } from '../../data-grid'

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
    return !!props.providers && !!props.providers?.[0] && (
        <GenericDataGrid<ETHTPSDataIntegrationsMSSQLProvider>
            dataType={DataGridType.Providers}
            data={props.providers} />
    )
}
