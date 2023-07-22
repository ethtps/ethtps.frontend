import * as d3 from 'd3'
import { ETHTPSDataCoreDataType } from 'ethtps.api'
import { SelectedSVG, Vector2D, liveDataPointExtractor } from '../../../..'
import { LiveDataAccumulator, LiveDataPoint, LiveDataPointWithPrevious, XYZDataPoint, logToOverlay } from '../../../../../ethtps.data/src'
import D3Data from './D3Data'
import { LinXYScale } from './Types'

export namespace D3Helpers.Visualization.Lines {
    export const lineGenerator = (curve: (d3.CurveFactory | d3.CurveFactoryLineOnly)) => d3.line<Vector2D>()
        .x((d: any) => d.x)
        .y((d: any) => d.y)
        .curve(curve)

    export const streamLines = (curve: (d3.CurveFactory), scale: LinXYScale, dataType: ETHTPSDataCoreDataType) => d3.area<LiveDataPointWithPrevious>()
        .x(d => scale.x(d.x ?? 0))
        .y0(d => scale.y((liveDataPointExtractor(d.previous, dataType) ?? 0)))
        .y1(d => scale.y(-(liveDataPointExtractor(d, dataType) ?? 0)))
        .curve(curve)

    export const streamArea = (curve: (d3.CurveFactory), scale: LinXYScale, dataType: ETHTPSDataCoreDataType) => d3.area<d3.SeriesPoint<XYZDataPoint>>()
        .x(d => scale.x(d.data.x))
        .y0(d => scale.y(d.data.y))
        .y1(d => scale.y(d.data.y))
        .curve(curve)

    export const linesFrom = (accumulator: LiveDataAccumulator, dataType: ETHTPSDataCoreDataType, scale: LinXYScale, colorScheme: readonly string[] = d3.schemePuRd[9], opacity: number = 0.5) => (
        selection: SelectedSVG
    ) => {
        const data = D3Data.stackAndGroup(accumulator.allFlat, d => liveDataPointExtractor(d, dataType) ?? 0)
        scale.y.domain([-(liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 0) * 1.2, 1.2 * (liveDataPointExtractor(accumulator.maxTotal, dataType) ?? 0)])
        accumulator.distinctProviders.forEach((p, i) => {
            //const dps = accumulator.getDataPointsFor(p) ?? []
            const dps = accumulator.allStacked.map(x => x?.[p])?.filter(x => !!x) ?? []
            selection.append('g')
                .selectAll('g')
                .data([0])
                .join('path')
                .attr('d', (d, i) => streamLines(d3.curveBasis, scale, dataType)(dps))
                .attr('fill', (d) => colorScheme[i % colorScheme.length])
                .attr('stroke-opacity', 1)
                .attr('fill-opacity', opacity)
                .attr('stroke-width', 2)
                .attr('stroke', (d) => colorScheme[i % colorScheme.length])
        })
    }
}

export default D3Helpers.Visualization.Lines