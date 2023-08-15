import { ConfigurationEditor, ConfigurationTab, CustomGenericTabPanel, ExperimentTab, UtilsTab, useQueryStringAndLocalStorageBoundState } from "@/ethtps.components"
import { APIContext } from "../../ethtps.components/src/admin/APIContext"
import { AdminAPIWrapper } from "../../ethtps.data"

import { Box } from "@chakra-ui/react"

export default function Home() {
    return <>
        <APIContext.Provider value={AdminAPIWrapper.DEFAULT}>
            <Box
                sx={{
                    padding: 0,
                    margin: 0,
                }}>
                <CustomGenericTabPanel items={[
                    { title: 'Overview', content: <>Nothing here</> },
                    { title: 'Configuration', content: <ConfigurationTab /> },
                    { title: 'Experiments', content: <ExperimentTab /> },
                    { title: 'Utils', content: <UtilsTab /> },
                    { title: 'Security', content: <>Nothing here</> }
                ]}
                    localStorageKey={'tab'} />
            </Box>
        </APIContext.Provider>
    </>
}