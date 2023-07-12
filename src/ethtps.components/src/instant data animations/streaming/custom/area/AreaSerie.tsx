import Konva from "konva"
import { Vector2d } from "konva/lib/types"
import React, { Key, useEffect, useRef, useState } from "react"
import { Shape } from "react-konva"
import { InstantDataAnimationProps, LiveDataPoint, dataExtractor, liveDataPointExtractor, useColors } from "../../../../.."
import { GenericDictionary, L2DataUpdateModel, linearMap } from "../../../../../../ethtps.data/src"

interface IAreaSerieProps extends Partial<InstantDataAnimationProps> {
    mountTime: number
    providerName: string
    lineColor?: string | null
    lineStrokeWidth?: number
    lineTension?: number
    fill?: string
    customKey: Key
    offsetBy?: number
    index?: number
    liveData?: LiveDataPoint[]
    lastValues?: GenericDictionary<LiveDataPoint>
}

type L2DataUpdateModelWithTimestamp = L2DataUpdateModel & { timestamp: number }

function gradient(a: Vector2d, b: Vector2d): Vector2d {
    return {
        x: (b.y - a.y) / (b.x - a.x),
        y: (b.x - a.x) / (b.y - a.y)
    }
}

function invert(x: Vector2d): Vector2d {
    return {
        x: x.y,
        y: x.x
    }
}

export function AreaSerie(props: IAreaSerieProps) {
    const xMap = (t?: number) => linearMap(offset + (t ?? 0), 0, 50, 0, (props.width ?? 0) / 2)
    const xAt = (t: number) => xMap(dataExtractor(allData[t]?.data, props.dataType))
    const yMap = (timestamp: number) => ((timestamp - props.mountTime!) / (props.duration ?? 1)) * (props.height ?? 0)
    const colors = useColors()
    const [data, setData] = useState<Vector2d[]>([])
    const [allData, setAllData] = useState<L2DataUpdateModelWithTimestamp[]>([])
    useEffect(() => {
        setData([])
    }, [])
    const shapeRef = React.useRef<Konva.Shape>(new Konva.Shape())
    const offset = props.offsetBy ?? 0
    const ref = useRef<Konva.Shape>(new Konva.Shape())
    useEffect(() => {
        const values = props.liveData?.map(x => ({
            timestamp: x.x,
            name: props.providerName,
            value: liveDataPointExtractor(x, props.dataType) ??
                liveDataPointExtractor(props.lastValues?.[props.providerName], props.dataType) ?? 0
        })) ?? []

        setData(values.flatMap(d => {
            return { x: xMap(d.value), y: yMap(d.timestamp) }
        }))

    }, [props.liveData])
    const sceneFunc = (ctx: Konva.Context, shape: Konva.Shape) => {
        if (!data || data.length === 0) {
            return
        }
        ctx.beginPath()
        let m: Vector2d = { x: 1, y: 1 }
        const f = props.lineTension ?? 0.5
        for (let i = 1; i < data.length - 1; i++) {
            let a = invert(data[i])
            let b = invert(data[i + 1])
            let mid = {
                x: (a.x + b.x) / 2,
                y: (a.y + b.y) / 2
            }
            let cp = {
                x: (a.x + mid.x) / 2,
                y: (b.x + mid.y) / 2
            }
            a = invert(a)
            b = invert(b)
            mid = invert(mid)
            cp = invert(cp)
            ctx.quadraticCurveTo(cp.x, a.y, mid.x, mid.y)
            ctx.quadraticCurveTo(cp.y, b.y, b.x, b.y)
        }
        ctx.stroke()
        /*
        ctx.closePath()
        ctx.fillStrokeShape(shape)*/
    }
    return (
        <Shape
            ref={ref}
            key={props.customKey}
            x={(props.width ?? 0) / 2}
            y={(props.height ?? 0) - (props.verticalPadding ?? 0)}
            stroke={props.lineColor ?? colors.text}
            strokeEnabled
            sceneFunc={sceneFunc}
            fill={'rgba(214, 157, 43,0.1)'}
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />
    )
}

/**
 *  old.push(...[x, y])
 *  <Line
            key={props.customKey}
            x={(props.width ?? 0) / 2}
            y={(props.height ?? 0) - (props.verticalPadding ?? 0)}
            data={data}
            stroke={props.lineColor ?? colors.text}
            strokeEnabled
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />


    <Shape
            ref={shapeRef}
            key={props.customKey}
            x={(props.width ?? 0) / 2}
            y={(props.height ?? 0) - (props.verticalPadding ?? 0)}
            sceneFunc={(ctx, shape) => {
                if (!allData || allData.length === 0) {
                    return
                }

                ctx.beginPath()
                const y0 = yMap(props.mountTime!)
                const ynow = yMap(Date.now())
                const lastX = xAt(allData.length - 1)
                ctx.moveTo(xMap(0), 0)
                for (let i = 0; i < allData.length; i++) {
                    const d = allData[i]
                    const x = xAt(i)
                    const y = yMap(d.timestamp)
                    ctx.lineTo(x, y)
                }
                ctx.lineTo(xMap(0), ynow)
                ctx.closePath()
                ctx.fillStrokeShape(shape)
            }}
            stroke={props.lineColor ?? (!!props.index ? interpolateCividis((props.index % 10) / 15) : undefined)}
            strokeEnabled
            fill={props.fill ?? (!!props.index ? interpolateCividis((props.index % 10) / 20) : undefined)}
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />
            */
