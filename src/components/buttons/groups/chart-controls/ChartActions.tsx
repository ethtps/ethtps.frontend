import { IOptionalCallback } from "@/data"
import { conditionalRender } from "@/services"
import { Stack, Tooltip } from "@chakra-ui/react"
import { IconDownload, IconMaximize } from "@tabler/icons-react"

export interface IChartActionsProps {
    showMaximize: boolean
    showDownload: boolean
    onDownload: () => void
    onMaximize: () => void
}

export function ChartActions(props: Partial<IChartActionsProps>) {
    return <>
        <Stack
            dir="col"
            sx={{
                float: 'right',
                display: 'flex',
            }}>
            {conditionalRender(<Tooltip label="Download .png">
                <IconDownload onClick={() => { if (props.onDownload) props.onDownload() }} size='1.5rem' />
            </Tooltip>, props.showDownload)}
            {conditionalRender(<Tooltip label="Maximize">
                <IconMaximize onClick={() => { if (props.onMaximize) props.onMaximize() }} size='1.5rem' />
            </Tooltip>, props.showMaximize)}
        </Stack>
    </>
}