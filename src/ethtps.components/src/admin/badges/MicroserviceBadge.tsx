
import { Badge } from '@chakra-ui/react'
import { ETHTPSConfigurationDatabaseMicroservice } from 'ethtps.admin.api'

interface IMicroserviceBadgeProps {
    microservice: ETHTPSConfigurationDatabaseMicroservice
    selected?: boolean
    key?: string | number
    onClick?: (microservice: ETHTPSConfigurationDatabaseMicroservice, newSelected: boolean) => void
}

export function MicroserviceBadge(props: IMicroserviceBadgeProps) {
    return <>
        <Badge
            key={props.key ?? props.microservice.name ?? 'unknown'}
            onClick={() => props.onClick && props.onClick(props.microservice, !props.selected)}
            title={props.microservice.name ?? 'unknown'}
            sx={{
                fontWeight: 'bold',
                backgroundColor: props.selected ? 'lightblue' : 'primary.gray',
                margin: '0.25rem',
                ":hover": {
                    backgroundColor: props.selected ? 'yellowgreen' : 'crimson',
                    cursor: 'pointer',
                    color: 'white',
                }
            }} />
    </>
}