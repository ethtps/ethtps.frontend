
import { Stack, Tooltip } from "@chakra-ui/react"
import { IconDownload, IconMaximize } from "@tabler/icons-react"
import { conditionalRender } from "../../../.."

export interface IChartActionsProps {
    showMaximize: boolean
    showDownload: boolean
    onDownload: () => void
    onMaximize: () => void
}

export function ChartActions(props: Partial<IChartActionsProps>): JSX.Element {
    return <>
        <Stack
            dir="col"
            sx={{
                float: 'right',
                display: 'flex',
            }}>
            {conditionalRender(<Tooltip title="Download .png">
                <IconDownload onClick={() => { if (props.onDownload) props.onDownload() }} size='20px' />
            </Tooltip>, props.showDownload)}
            {conditionalRender(<Tooltip title="Maximize">
                <IconMaximize onClick={() => { if (props.onMaximize) props.onMaximize() }} size='20px' />
            </Tooltip>, props.showMaximize)}
        </Stack>
    </>
}