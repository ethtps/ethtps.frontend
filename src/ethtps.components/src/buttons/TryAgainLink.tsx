
import { Alert, AlertIcon, Text } from '@chakra-ui/react'
import { useColors } from '../..'

export function TryAgainLink() {
    const colors = useColors()
    return <Alert status='error'>
        <AlertIcon />
        <Text>
            An error occurred. Click <a href="javascript:window.location.href=window.location.href" style={{
                backgroundColor: colors.highlight,
                padding: '1px'
            }}>here</a> to try again.
        </Text>
    </Alert>
}