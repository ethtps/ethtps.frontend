import { Box, Tab, TabPanel, Tabs } from "@chakra-ui/react"
import { useState } from "react"
import { a11yProps } from "../../TabPanel"
import { ExperimentManagement } from "./ExperimentManagement"

export function ExperimentTab() {
    const [value, setValue] = useState(parseInt(localStorage.getItem('exptab') || '0'))

    const handleChange = (newValue: number) => {
        setValue(newValue)
        localStorage.setItem('exptab', newValue.toString())
    }
    return <>
        <Tabs
            variant='scrollable'
            index={value}
            onChange={(i) => handleChange(i)}>
            <Tab title="Overview" {...a11yProps(0)} />
            <Tab title="Management" {...a11yProps(1)} />
            <Tab title="Feedback" {...a11yProps(2)} />
            <Tab title="Results" {...a11yProps(3)} />
            <Tab title="Analysis" {...a11yProps(4)} />
        </Tabs>
        <Box display={'flex'}>
            <TabPanel>
            </TabPanel>
            <TabPanel>
                <ExperimentManagement />
            </TabPanel>
            <TabPanel>
            </TabPanel>
            <TabPanel>
            </TabPanel>
            <TabPanel>
                Nothing here
            </TabPanel>
        </Box>
    </>
}