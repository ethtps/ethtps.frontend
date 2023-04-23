import { conditionalRender } from "@/services";
import { ActionIcon, Group, Tooltip } from "@mantine/core";
import { IconDownload, IconMaximize } from "@tabler/icons-react";

export interface IChartActionsProps {
    showMaximize: boolean
    showDownload: boolean
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
                    <IconDownload size='1.5rem' />
                </ActionIcon>
            </Tooltip>, props.showDownload)}
            {conditionalRender(<Tooltip label="Maximize">
                <ActionIcon>
                    <IconMaximize size='1.5rem' />
                </ActionIcon>
            </Tooltip>, props.showMaximize)}
        </Group>
    </>
}