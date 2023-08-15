import { Box, Button, Card, CardBody, CardFooter, Text } from '@chakra-ui/react'
import { ETHTPSDataIntegrationsMSSQLExperiment } from 'ethtps.admin.api'


const bull = (
    <Box
        sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
    >
        •
    </Box>
)

export default function ExperimentCard(props: Partial<ETHTPSDataIntegrationsMSSQLExperiment>) {
    return (
        <Card sx={{ minWidth: 275 }}>
            <CardBody>
                <Text sx={{ fontSize: 14 }} color="text.secondary" >
                    Word of the Day
                </Text>
                <Text variant="h5" >
                    be{bull}nev{bull}o{bull}lent
                </Text>
                <Text sx={{ mb: 1.5 }} color="text.secondary">
                    adjective
                </Text>
                <Text variant="body2">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Text>
            </CardBody>
            <CardFooter >
                <Button size="small">Learn More</Button>
            </CardFooter >
        </Card>
    )
}