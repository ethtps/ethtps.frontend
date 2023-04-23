import { ProviderResponseModel } from "@/api-client"
import { Tabs, Title, Text, SegmentedControl, Box } from "@mantine/core"
import { BreakdownTab, CompareTab, DetailsTab, ProviderChartSection, StatusTab, TransactionTypeTab, VolumeTab, YearlyHeatmap } from '..'
import { IconChartBar, IconTextCaption, IconChartRadar, IconGeometry, IconDatabase, IconHammer } from "@tabler/icons-react"
import { AnalysisTabStrings, DefaultStrings } from "../descriptions"
import { setQueryParams } from "@/components"

interface IAnalysisTabProps {
    provider: ProviderResponseModel
}

export function AnalysisTab(props: Partial<IAnalysisTabProps>) {

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