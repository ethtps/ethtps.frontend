import {
    Tooltip,
    TooltipWithBounds,
    defaultStyles,
    useTooltip,
    useTooltipInPortal,
} from '@visx/tooltip'
import React, { useCallback, useState } from 'react'
import { Vector2D, conditionalRender } from '../../..'

export type TooltipProps = {
    width: number
    height: number
    showControls?: boolean
    children?: React.ReactNode
    onMouseMove?: (e?:Vector2D)=>void
}

type TooltipData = string

const positionIndicatorSize = 8

const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: 'rgba(53,71,125,0.8)',
    color: 'white',
    width: 152,
    height: 72,
    padding: 12,
}

export function VisTooltip({ width, height, showControls = true, children, onMouseMove }: TooltipProps) {
    const [tooltipShouldDetectBounds, setTooltipShouldDetectBounds] = useState(true)
    const [renderTooltipInPortal, setRenderTooltipInPortal] = useState(true)

    const { containerRef, containerBounds, TooltipInPortal } = useTooltipInPortal({
        scroll: true,
        detectBounds: tooltipShouldDetectBounds,
    })

    const {
        showTooltip,
        hideTooltip,
        tooltipOpen,
        tooltipData,
        tooltipLeft = 0,
        tooltipTop = 0,
    } = useTooltip<TooltipData>({
        // initial tooltip state
        tooltipOpen: false,
        tooltipLeft: width / 3,
        tooltipTop: height / 3,
        tooltipData: 'nodata',
    })
    // event handlers
    const handlePointerMove = useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            // coordinates should be relative to the container in which Tooltip is rendered
            const containerX = ('clientX' in event ? event.clientX : 0) - containerBounds.left
            const containerY = ('clientY' in event ? event.clientY : 0) - containerBounds.top
            showTooltip({
                tooltipLeft: containerX,
                tooltipTop: containerY,
                tooltipData: 'hello'
            })
            onMouseMove?.({ x: containerX, y: containerY } as Vector2D)
        },
        [showTooltip, tooltipShouldDetectBounds, containerBounds],
    )

    const TooltipComponent = renderTooltipInPortal
        ? TooltipInPortal
        : tooltipShouldDetectBounds
            ? TooltipWithBounds
            : Tooltip

    return (
        <>
            <div
                ref={containerRef}
                className="tooltip"
                style={{ width, height }}
                onPointerMove={handlePointerMove}
                onPointerLeave={hideTooltip}
            >
                {children}
                {conditionalRender(<>
                    <div
                        className="crosshair horizontal"
                        style={{ transform: `translateY(${tooltipTop}px)` }}
                    />
                    <div
                        className="crosshair vertical"
                        style={{ transform: `translateX(${tooltipLeft}px)` }}
                    />
                    <TooltipComponent
                        key={Math.random()} // needed for bounds to update correctly
                        left={tooltipLeft}
                        top={tooltipTop}
                        style={tooltipStyles}
                    >
                        {tooltipData}
                        <br />
                        <br />
                        <strong>left</strong> {tooltipLeft?.toFixed(0)}px&nbsp;&nbsp;
                        <strong>top</strong> {tooltipTop?.toFixed(0)}px
                    </TooltipComponent>
                    <div
                        className="position-indicator"
                        style={{
                            transform: `translate(${tooltipLeft - positionIndicatorSize / 2}px, ${tooltipTop - positionIndicatorSize / 2}px)`,
                        }}
                    />
                </>, tooltipOpen)}
            </div>
            <style>{`
        .tooltip {
          z-index: 0;
          position: relative;
          overflow: hidden;
          border-radius: 16px;
          font-size: 13px;
          color: white;
          width: 100%;
          height: 100%;
          marginTop: -50%;
          marginLeft: -50%;
        }
        .tooltip-controls label {
          font-size: 14px;
          margin-right: 8px;
        }
        .position-indicator {
          width: ${positionIndicatorSize}px;
          height: ${positionIndicatorSize}px;
          border-radius: 50%;
          background: #35477d;
          position: absolute;
        }
        .crosshair {
          position: absolute;
          top: 0;
          left: 0;
        }
        .crosshair.horizontal {
          width: 100%;
          height: 1px;
          border-top: 1px dashed #35477d;
        }
        .crosshair.vertical {
          height: 100%;
          width: 1px;
          border-left: 1px dashed #35477d;
        }
        .no-tooltip {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
        </>
    )
}