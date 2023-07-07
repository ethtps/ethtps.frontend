/* eslint-disable import/no-internal-modules */
import { Box, TabList, TabPanel, Tabs, Text } from "@chakra-ui/react"
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { useState } from "react"
import { BreakdownTab } from '..'

interface IAnalysisTabProps {
    provider: ETHTPSDataCoreModelsResponseModelsProviderResponseModel
    selectedTab: string
}

export function AnalysisTab(props: Partial<IAnalysisTabProps>): JSX.Element {
    const [tab, setTab] = useState<string | undefined>(props.selectedTab)
    return <>
        <Box sx={{ marginLeft: '1rem' }}>
            <Tabs
                defaultValue="breakdown">
                <TabList>
                    <TabPanel ><Text>Breakdown</Text></TabPanel>
                </TabList>

                <TabPanel pt="md">
                    <BreakdownTab {...props} />
                </TabPanel>

            </Tabs>
        </Box >
    </>
}