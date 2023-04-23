import { ProviderResponseModel } from "@/api-client"
import { Tabs, Text, Box } from "@mantine/core"
import { BreakdownTab } from '..'
import { IconHammer } from "@tabler/icons-react"
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
                <Tabs.List>
                    <Tabs.Tab value="breakdown" icon={<IconHammer size={'1.1rem'} />}><Text>Breakdown</Text></Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="breakdown" pt="md">
                    <BreakdownTab {...props} />
                </Tabs.Panel>

            </Tabs>
        </Box >
    </>
}