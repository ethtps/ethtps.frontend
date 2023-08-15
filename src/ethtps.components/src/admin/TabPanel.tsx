import { Box } from "@chakra-ui/react"

export interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    }
}

export function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            style={{ width: '100%' }}
            role={'tabpanel'}
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3, m: 0 }}>
                    {children}
                </Box>
            )}
        </div>
    )
}