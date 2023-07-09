import dynamic from "next/dynamic"
import { Suspense } from "react"
import { InstantDataAnimationProps } from "../InstantDataAnimationProps"

const data = [
    {
        "id": "step_sent",
        "value": 91448,
        "label": "Sent"
    },
    {
        "id": "step_viewed",
        "value": 78271,
        "label": "Viewed"
    },
    {
        "id": "step_clicked",
        "value": 63555,
        "label": "Clicked"
    },
    {
        "id": "step_add_to_card",
        "value": 52450,
        "label": "Add To Card"
    },
    {
        "id": "step_purchased",
        "value": 34841,
        "label": "Purchased"
    }
]

export function InstantFunnel(props: InstantDataAnimationProps) {
    const Funn = dynamic(() => import('@nivo/funnel').then((mod) => mod.Funnel), { ssr: false })
    return <>
        <div className="chart">
            <Suspense fallback={<div>Loading...</div>}>
                <Funn
                    width={600}
                    height={600}
                    data={data}
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    direction="horizontal"
                    valueFormat=">-.4s"
                    fillOpacity={0.75}
                    borderWidth={19}
                    borderColor={{ from: 'color', modifiers: [] }}
                    borderOpacity={0.6}
                    labelColor={{
                        from: 'color',
                        modifiers: [
                            [
                                'brighter',
                                3
                            ]
                        ]
                    }}
                    beforeSeparatorLength={100}
                    beforeSeparatorOffset={19}
                    afterSeparatorLength={100}
                    afterSeparatorOffset={20}
                    currentPartSizeExtension={10}
                    currentBorderWidth={40}
                    motionConfig="wobbly"
                />
            </Suspense>
        </div>
        <style jsx>{
            `
                   .chart {
                        height:50vh;
                        width:60vw;
                        background: white;
                        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
                        transition: 0.3s;
                    }

                    .chart:hover {
                         box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2);
                    }
                    `
        }
        </style>
    </>
}