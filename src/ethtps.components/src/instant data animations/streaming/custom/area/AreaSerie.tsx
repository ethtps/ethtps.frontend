import Konva from "konva"
import { Vector2d } from "konva/lib/types"
import React, { Key, useEffect, useRef, useState } from "react"
import { Shape } from "react-konva"
import { makeInteractive } from "../../../../"
import { IInstantDataAnimationProps, dataExtractor, liveDataPointExtractor, useColors } from "../../../../.."
import { GenericDictionary, L2DataUpdateModel, LiveDataPoint, linearMap } from "../../../../../../ethtps.data/src"

interface IAreaSerieProps extends Partial<IInstantDataAnimationProps> {
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

function invert(x: Vector2d): Vector2d {
    return {
        x: x.y,
        y: x.x
    }
}

export function AreaSerie(props: IAreaSerieProps) {
    const interactions = makeInteractive(props)
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
            return { x: xMap(d.value), y: yMap(d.timestamp ?? 0) }
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
            x={interactions.position.x + (props.width ?? 0) / 2}
            y={interactions.position.y + (props.height ?? 0) - (interactions.padding.paddingBottom + interactions.padding.paddingTop) - (interactions.margins?.marginTop ?? 0) - (interactions.margins?.marginBottom ?? 0)}
            stroke={props.lineColor ?? colors.text}
            strokeEnabled
            sceneFunc={sceneFunc}
            fill={'rgba(214, 157, 43,0.1)'}
            strokeWidth={props.lineStrokeWidth}
            tension={props.lineTension} />
    )
}