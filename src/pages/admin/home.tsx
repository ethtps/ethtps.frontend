import { ConfigurationEditor, ConfigurationTab, CustomGenericTabPanel, useQueryStringAndLocalStorageBoundState } from "@/ethtps.components"
import { APIContext } from "@/ethtps.components/src/admin/APIContext"
import { AdminAPIWrapper } from "@/ethtps.data"

import { Box } from "@chakra-ui/react"

export default function Home() {
    const [value, setValue] = useQueryStringAndLocalStorageBoundState(undefined, 'tab')

    return <>
        <APIContext.Provider value={AdminAPIWrapper.DEFAULT}>
            <Box
                display={'flex'}
                flexDirection={'column'}
                alignContent={'center'}
                sx={{
                    padding: 0,
                    margin: 0,
                }}>
                <CustomGenericTabPanel items={[
                    { title: 'Overview', content: <>Nothing here</> },
                    { title: 'Configuration', content: <ConfigurationTab /> },
                    { title: 'Experiments', content: <>Nothing here</> },
                    { title: 'Utils', content: <>Nothing here</> },
                    { title: 'Security', content: <>Nothing here</> }
                ]}
                    localStorageKey={'tab'} />
            </Box>
        </APIContext.Provider>
    </>
}