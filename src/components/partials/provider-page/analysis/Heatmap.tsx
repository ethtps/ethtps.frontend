// install (please make sure versions match peerDependencies)
// yarn add @nivo/core @nivo/calendar
import { ProviderResponseModel } from '@/api-client'
import { CalendarCanvasProps, CalendarLegendProps, CalendarSvgProps, DateOrString, ResponsiveCalendar, ResponsiveCalendarCanvas } from '@nivo/calendar'
import { dummyHeatmapData } from '..'
import { Box } from '@chakra-ui/react'
import { useCallback, useEffect, useState } from 'react'

interface IHeatmapProps {
    provider: ProviderResponseModel
    year: number,
    interactive?: boolean,
    from: DateOrString,
    to: DateOrString,
}

const baseSize = 200
const yearSpacing = 100

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
    yearSpacing: yearSpacing,
    monthBorderColor: "#ffffff",
    dayBorderWidth: 2,
    dayBorderColor: "#ffffff",
}

const generateResponsiveProps = (ratio: number, from: DateOrString, to: DateOrString, data: HeatmapDataPoint[]): Omit<CalendarSvgProps, 'width' | 'height'> => {
    return {
        ...baseProps,
        data: data,
        from: from,
        to: to,
        direction: ratio > 1 ? 'horizontal' : 'vertical',
        legends: generateLegend(ratio)
    }
}

const generateCanvasProps = (ratio: number, from: DateOrString, to: DateOrString, data: HeatmapDataPoint[]): Omit<CalendarCanvasProps, 'width' | 'height'> => {
    return {
        ...baseProps,
        data: data,
        from: from,
        to: to,
        direction: ratio > 1 ? 'horizontal' : 'vertical',
        legends: generateLegend(ratio)
    }
}

const currentYear = new Date().getFullYear()

function getYearsBetween(from?: string, to?: string) {
    if (!from || !to) return 1
    const fromYear = parseInt(from.slice(0, 4))
    const toYear = parseInt(to.slice(0, 4))
    return toYear - fromYear
}

export function Heatmap({
    provider,
    interactive,
    from,
    to
}: Partial<IHeatmapProps>) {
    const ratio = 16 / 9
    const propGenerator = useCallback((from: DateOrString, to: DateOrString) => {
        if (interactive) {
            return generateResponsiveProps(ratio, from, to, dummyHeatmapData)
        }
        else {
            return generateCanvasProps(ratio, from, to, dummyHeatmapData)
        }
    }, [ratio, interactive])

    const getCalendar = useCallback(() => {
        if (interactive) {
            return <ResponsiveCalendar {...(propGenerator(from ?? `${currentYear}-01-01`, to ?? `${currentYear}-12-31`) as CalendarSvgProps)} />
        }
        else {
            return <ResponsiveCalendarCanvas {...(propGenerator(from ?? `${currentYear}-01-01`, to ?? `${currentYear}-12-31`) as CalendarCanvasProps)} />
        }
    }, [interactive, propGenerator, from, to])
    const numberOfYears = getYearsBetween(from?.toString(), to?.toString())
    const size = baseSize * numberOfYears + yearSpacing * (numberOfYears - 0)
    return <>
        < >
            <Box
                h={ratio > 1 ? size : '100vh'}
                w={Math.max(size, 800)}>
                {getCalendar()}
            </Box>
        </>
    </>
}