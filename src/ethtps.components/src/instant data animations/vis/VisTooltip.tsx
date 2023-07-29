import {
    Tooltip,
    TooltipWithBounds,
    defaultStyles,
    useTooltip,
    useTooltipInPortal,
} from '@visx/tooltip'
import React, { useCallback, useState } from 'react'
import { Vector2D, conditionalRender, useColors } from '../../..'

export type TooltipProps = {
    width: number
    height: number
    showControls?: boolean
    children?: React.ReactNode
    onMouseMove?: (e?: Vector2D) => void
    /**
     * Reference to the object whose events are being swallowed by the tooltip.
     */
    forwardRef?: React.RefObject<any>
    /**
     * What to render in the tooltip. Return undefined to hide the tooltip.
     */
    content?: TooltipData
}

type TooltipData = JSX.Element

const positionIndicatorSize = 8

const tooltipStyles = {
    ...defaultStyles,
    backgroundColor: 'rgba(53,71,125,0.8)',
    color: 'white',
    width: 152,
    height: 72,
    padding: 12,
}

export function VisTooltip({ width, height, showControls = true, children, onMouseMove, content }: TooltipProps) {
    const colors = useColors()
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
                tooltipData: content,
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
                onPointerLeave={hideTooltip}>
                {conditionalRender(<>
                    <div
                        className="crosshair horizontal"
                        style={{ borderColor: colors.crosshair, transform: `translateY(${tooltipTop}px)` }}
                    />
                    <div
                        className="crosshair vertical"
                        style={{ borderColor: colors.crosshair, transform: `translateX(${tooltipLeft}px)` }}
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
                            backgroundColor: colors.crosshair,
                            transform: `translate(${tooltipLeft - positionIndicatorSize / 2}px, ${tooltipTop - positionIndicatorSize / 2}px)`,
                        }}
                    />
                </>, tooltipOpen)}
                {children}
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
          pointer-events: none;
        }
        .position-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #35477d;
          position: absolute;
          pointer-events: none;
        }
        .crosshair {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
        }
        .crosshair.horizontal {
          width: 100%;
          height: 1px;
          border-top: 1px dashed ;
          pointer-events: none;
        }
        .crosshair.vertical {
          height: 100%;
          width: 1px;
          border-left: 1px dashed;
          pointer-events: none;
        }
        .no-tooltip {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
      `}</style>
        </>
    )
}