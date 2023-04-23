// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/calendar
import { ProviderResponseModel } from '@/api-client'
import { CalendarCanvasProps, CalendarLegendProps, CalendarSvgProps, ResponsiveCalendar, ResponsiveCalendarCanvas } from '@nivo/calendar'
import { dummyHeatmapData } from '..'
import { Box } from '@mantine/core'
import { useViewportRatio } from '@/components'
import { useCallback, useEffect, useState } from 'react'
import { getDate } from 'date-fns'
import { CalendarProps } from 'react-date-range'

interface IYearlyHeatmapProps {
    provider: ProviderResponseModel
    year: number,
    interactive?: boolean
}

const baseHeight = 200

export type HeatmapDataPoint = {
    value: number
    day: string
}

const generateLegend = (ratio: number): CalendarLegendProps[] => {
    return [
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
    ]
}

const baseProps = {
    emptyColor: "#eeeeee",
    colors: ['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560'],
    margin: { top: 40, right: 40, bottom: 40, left: 40 },
    yearSpacing: 40,
    monthBorderColor: "#ffffff",
    dayBorderWidth: 2,
    dayBorderColor: "#ffffff",
}

const generateResponsiveProps = (ratio: number, year: number, data: HeatmapDataPoint[]): Omit<CalendarSvgProps, 'width' | 'height'> => {
    return {
        ...baseProps,
        data: data,
        from: `${year}-01-01`,
        to: `${year}-12-31`,
        direction: ratio > 1 ? 'horizontal' : 'vertical',
        legends: generateLegend(ratio)
    }
}

const generateCanvasProps = (ratio: number, year: number, data: HeatmapDataPoint[]): Omit<CalendarCanvasProps, 'width' | 'height'> => {
    return {
        ...baseProps,
        data: data,
        from: `${year}-01-01`,
        to: `${year}-12-31`,
        direction: ratio > 1 ? 'horizontal' : 'vertical',
        legends: generateLegend(ratio)
    }
}

export function YearlyHeatmap({
    provider,
    year,
    interactive
}: Partial<IYearlyHeatmapProps>) {
    const ratio = useViewportRatio()
    const propGenerator = useCallback((year: number) => {
        if (interactive) {
            return generateResponsiveProps(ratio, year, dummyHeatmapData)
        }
        else {
            return generateCanvasProps(ratio, year, dummyHeatmapData)
        }
    }, [ratio, interactive])

    const getCalendar = useCallback((year: number) => {
        if (interactive) {
            return <ResponsiveCalendar {...(propGenerator(year) as CalendarSvgProps)} />
        }
        else {
            return <ResponsiveCalendarCanvas {...(propGenerator(year) as CalendarCanvasProps)} />
        }
    }, [interactive, propGenerator])

    useEffect(() => {
    }, [year])
    return <>
        <Box h={ratio > 1 ? baseHeight : '100vh'}>
            {getCalendar(year ?? (new Date()).getFullYear())}
        </Box>
    </>
}