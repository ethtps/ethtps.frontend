// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/calendar
import { ProviderResponseModel } from '@/api-client'
import { ResponsiveCalendar, ResponsiveCalendarCanvas } from '@nivo/calendar'
import { dummyHeatmapData } from '..'
import { Box } from '@mantine/core'
import { useViewportRatio } from '@/components'
import { useEffect, useState } from 'react'
interface IYearlyHeatmapProps {
    provider: ProviderResponseModel
    year: number
}

const baseHeight = 200

export function YearlyHeatmap({
    provider,
    year = 2023
}: Partial<IYearlyHeatmapProps>) {
    const ratio = useViewportRatio()
    useEffect(() => {
    }, [year])
    return <>
        <Box w={'100%'} h={ratio > 1 ? baseHeight : '100vh'}>
            <ResponsiveCalendar
                data={dummyHeatmapData}
                from={`${year}-01-01`}
                to={`${year}-12-31`}
                emptyColor="#eeeeee"
                colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                yearSpacing={40}
                monthBorderColor="#ffffff"
                dayBorderWidth={2}
                direction={ratio > 1 ? 'horizontal' : 'vertical'}
                dayBorderColor="#ffffff"
                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'row',
                        translateY: 36,
                        itemCount: 4,
                        itemWidth: 42,
                        itemHeight: 36,
                        itemsSpacing: 14,
                        itemDirection: (ratio > 1) ? 'left-to-right' : 'top-to-bottom'
                    }
                ]}
            />
        </Box>
    </>
}