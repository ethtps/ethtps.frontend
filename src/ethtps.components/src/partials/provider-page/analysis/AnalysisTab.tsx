/* eslint-disable import/no-internal-modules */
import { ProviderResponseModel } from "@/api-client"
import { Text, Box, Tabs, TabList, TabPanel } from "@chakra-ui/react"
import { BreakdownTab } from '..'
import { useState } from "react"

interface IAnalysisTabProps {
    provider: ProviderResponseModel
    selectedTab: string
}

export function AnalysisTab(props: Partial<IAnalysisTabProps>) {
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