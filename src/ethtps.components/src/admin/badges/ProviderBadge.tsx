
import { Badge, Text } from '@chakra-ui/react'
import { ETHTPSDataIntegrationsMSSQLProvider } from 'ethtps.api'

interface IProviderBadgeProps {
    provider: ETHTPSDataIntegrationsMSSQLProvider
    selected?: boolean
    disabled?: boolean
    key?: string | number
    onClick?: (provider: ETHTPSDataIntegrationsMSSQLProvider, newSelected: boolean) => void
}
export function ProviderBadge(props: IProviderBadgeProps) {
    return <Badge>
        <Text>{props.provider.name}</Text>
    </Badge >
}