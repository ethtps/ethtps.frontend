// eslint-disable-next-line import/no-internal-modules
import styles from '../../../../../../styles/app.module.scss'
import { ProviderResponseModel } from "@/api-client"
import { Heatmap } from "../.."
import { Image, Text, Group, Modal, Paper, Space, Title, Center, Select } from "@mantine/core"
import { ChartActions, SocialButtons, useViewportRatio } from "@/components"
import { useDisclosure } from "@mantine/hooks"
import { useCallback, useState } from "react"
import { conditionalRender } from '@/services'

interface IHeatmapTabProps {
    provider: ProviderResponseModel
}

enum Breakdowns {
    tps = "transactions per second", gps = "gas per second", gtps = "gas-adjusted transactions per second"
}

enum BreakdownPeriods {
    year = "year", month = "month", day = "day", hourOfDay = "hour of day", dayOfWeek = "day of week"
}

const plusYearsShown = 1
const minusYearsShown = 1

export function HeatmapTab(props: Partial<IHeatmapTabProps>) {
    const [modelOpened, { open, close }] = useDisclosure(false);
    const ratio = useViewportRatio()
    const [year, setYear] = useState<number>((new Date()).getFullYear())
    const [breakdown, setBreakdown] = useState<Breakdowns>(Breakdowns.tps)
    const [breakdownPeriod, setBreakdownPeriod] = useState<BreakdownPeriods>(BreakdownPeriods.year)

    const getHeatmap = useCallback(() => {
        return <>
            <Paper sx={{
                padding: '1rem',
            }}>
                <Center>
                    <Group sx={{
                        marginLeft: '2rem'
                    }}>
                        <Text className={'inline'} sx={{
                            marginRight: '0.1rem',
                            marginLeft: '0.1rem'
                        }}>Average {props.provider?.name}</Text>
                        <Select
                            onChange={(e) => setBreakdown(e as Breakdowns)}
                            className={'inline'}
                            defaultValue={Breakdowns.tps}
                            data={Object.values(Breakdowns).map(x => {
                                return { label: x, value: x }
                            })}
                        />
                        <Text className={'inline'} sx={{
                            marginRight: '0.1rem',
                            marginLeft: '0.1rem'
                        }}>grouped by</Text>
                        <Select className={'inline'}
                            width={'auto'}
                            onChange={(e) => setBreakdownPeriod(e as BreakdownPeriods)}
                            defaultValue={BreakdownPeriods.year}
                            data={Object.values(BreakdownPeriods).map(x => {
                                return { label: x, value: x }
                            })}
                        />
                    </Group>
                </Center>
                <Heatmap
                    from={`${year - minusYearsShown}-01-01`}
                    to={`${year + plusYearsShown}-12-31`}
                    provider={props.provider}
                    interactive={true} />
            </Paper>
        </>
    }, [props.provider, year])

    return <>
        <Modal
            fullScreen={ratio < 1}
            opened={modelOpened} size="calc(100vw - 1rem)" onClose={close} title={
                <Text style={{ verticalAlign: "middle" }} className={styles.logoish}>ETHTPS.info</Text>
            } centered >
            <Group position='center'>
                <SocialButtons />
            </Group>
            <Center>
                {getHeatmap()}
            </Center>
        </Modal>

        <div>
            <ChartActions
                showDownload
                showMaximize
                onMaximize={() => open()} />
        </div>
        <Space h="xl" />
        {getHeatmap()}
    </>
}