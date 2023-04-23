import { IOptionalCallback } from "@/data";
import { conditionalRender } from "@/services";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconDownload, IconMaximize } from "@tabler/icons-react";

export interface IChartActionsProps {
    showMaximize: boolean
    showDownload: boolean
    onDownload: () => void
    onMaximize: () => void
}

export function ChartActions(props: Partial<IChartActionsProps>) {
    return <>
        <Group
            dir="col"
            sx={{
                float: 'right',
                display: 'flex',
            }}>
            {conditionalRender(<Tooltip label="Download .png">
                <ActionIcon>
                    <IconDownload onClick={() => { if (props.onDownload) props.onDownload() }} size='1.5rem' />
                </ActionIcon>
            </Tooltip>, props.showDownload)}
            {conditionalRender(<Tooltip label="Maximize">
                <ActionIcon>
                    <IconMaximize onClick={() => { if (props.onMaximize) props.onMaximize() }} size='1.5rem' />
                </ActionIcon>
            </Tooltip>, props.showMaximize)}
        </Group>
    </>
}