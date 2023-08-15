
import { Alert, Box, Container, Stack, Text } from "@chakra-ui/react"
import { CustomGenericTabPanel, binaryConditionalRender } from "../../../.."
import { ExperimentControls } from "./ExperimentControls"
import { useExperimentTargets, useExperiments } from "./tabs/Hooks"

export function ExperimentManagement() {
    const experiments = useExperiments()
    const experimentTargets = useExperimentTargets()
    return <>
        <CustomGenericTabPanel
            items={[
                {
                    title: 'Experiments', content: <>
                        <Container sx={{ width: '100%' }}>
                            <Stack dir={'column'} spacing={2}>
                                <Alert sx={{
                                    fontSize: '1.1rem'
                                }} security="info">
                                    Manage experiments
                                </Alert>
                                <Box sx={{
                                    float: 'right',
                                }}> <ExperimentControls />
                                </Box>
                                {binaryConditionalRender(<Text>No experiments available</Text>, <>
                                    <Box display={'flex'}>
                                        Grid

                                    </Box>
                                </>, experiments?.length === 0)}
                            </Stack>
                        </Container>
                    </>
                },
                { title: 'Targets', content: <></> },
                { title: 'Target types', content: <></> },
                { title: 'Run parameters', content: <></> }]}
            localStorageKey={'subexptab'} />
    </>
}