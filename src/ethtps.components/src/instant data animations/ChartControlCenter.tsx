import { Box, Button, Tooltip } from "@chakra-ui/react"
import { useSize } from '@chakra-ui/react-use-size'
import { IconBadgeHd, IconBadgeSd, IconLink, IconLinkOff, IconPlayerPause, IconPlayerPlay, IconWindowMaximize } from "@tabler/icons-react"
import { ETHTPSDataCoreTimeInterval } from "ethtps.api"
import { connected } from "process"
import { ReactNode, useEffect, useMemo, useRef, useState } from "react"
import ReactDOM from "react-dom"
import { ExpandType, IChartControlCenterProps, TimeIntervalButtonGroup, binaryConditionalRender, conditionalRender, expandIcons, expandRatios, openNewTab, useColors } from ".."
import { ExtendedTimeInterval, TimeIntervalToStreamProps } from "../../../ethtps.data/src"

/**
 * An expandable chart control center that provides all possible controls for a chart or a simpler version of it
 * @param param0
 * @returns
 */
export function ChartControlCenter({
  showSidechains,
  showSidechainsToggled,
  height,
  floaty,
  expandedChanged,
  intervalHook,
  children,
  width,
  pausedHook,
  isMaximizedHook,
  expandType = ExpandType.ExpandVertically
}: IChartControlCenterProps) {
  const colors = useColors()
  const [interval, setInterval] = intervalHook
  const containerRef = useRef<any>(null)
  const controlRef = useRef<any>(null)
  const sizeRef = useSize(containerRef)
  const controlBoxSizeRef = useSize(controlRef)
  setInterval(ETHTPSDataCoreTimeInterval.ONE_MINUTE)
  const [streamConfig, setStreamConfig] = useState(() => TimeIntervalToStreamProps(interval))
  useEffect(() => {
    setStreamConfig(TimeIntervalToStreamProps(interval))
  }, [interval])
  const [paused, setPaused] = pausedHook
  const [isLowRes, setIsLowRes] = useState(() => false)
  const [resMultiplier, setResMultiplier] = useState(() => 1)
  useEffect(() => {
    setResMultiplier(isLowRes ? 0.5 : 1)
  }, [isLowRes])
  const [isMaximized, setIsMaximized] = isMaximizedHook
  // Factor by which to multiply divide the height of the chart when it is maximized
  const heightMultiplier = !floaty.isOpen ? 1 : expandRatios[expandType]
  const finalChartHeight = height * heightMultiplier
  const finalChartContainerHeight = finalChartHeight + ((!!floaty.isOpen ? undefined : controlBoxSizeRef?.height) ?? 0)
  const controlPad = Math.round(6 * (1.5 * heightMultiplier))
  const f = useMemo<(i: ReactNode) => ReactNode>(() => {
    if (expandType === ExpandType.None || !floaty.isOpen) return (i: React.ReactNode) => (i)
    return (i: React.ReactNode) => (ReactDOM.createPortal(i, document.getElementById('aliens')!))  //are already here
  }, [floaty.isOpen])
  const expIcons = useMemo(() => expandIcons[expandType], [expandType])
  return <>
    {(<Box
      ref={controlRef}
      bg={colors.chartBackground}
      w={!!floaty.isOpen && expandType === ExpandType.Float ? '100vw' : sizeRef?.width ?? width ?? 'inherit'}
      padding={`${controlPad}px`}
      borderWidth={0}
      bottom={!!floaty.isOpen && expandType === ExpandType.Float ? 0 : undefined}
      left={!!floaty.isOpen && expandType === ExpandType.Float ? 0 : undefined}
      borderRadius={'lg'}
      overflowX={'visible'}
      pos={!!floaty.isOpen && expandType === ExpandType.Float ? 'fixed' : 'relative'}>
      <TimeIntervalButtonGroup onChange={(v: ExtendedTimeInterval) => setInterval(v)} />
      <Tooltip
        label={`Sidechains ${showSidechains ? 'shown' : 'hidden'
          }. Click to toggle`}>
        <Button
          iconSpacing={0}
          leftIcon={
            showSidechains ? <IconLink /> : <IconLinkOff />
          }
          variant={'ghost'}
          onClick={showSidechainsToggled}
        />
      </Tooltip>
      <Tooltip label={`Click to ${paused ? 'resume' : 'pause'} `}>
        <Button
          disabled={!connected}
          iconSpacing={0}
          leftIcon={
            paused ? (
              <IconPlayerPlay />
            ) : (
              <IconPlayerPause />
            )
          }
          variant={'ghost'}
          onClick={() => setPaused(!paused)}
        />
      </Tooltip>
      {conditionalRender(
        <Tooltip label={`${isMaximized ? 'Collapse' : 'Expand'} `}>
          <Button
            iconSpacing={0}
            leftIcon={!isMaximized ? expIcons.expand : expIcons.collapse}
            variant={'ghost'}
            onClick={() => {
              const newValue = !isMaximized
              expandedChanged?.(newValue, {
                width: !newValue ? window.innerWidth : sizeRef?.width,
                height: controlPad / 2 + (controlBoxSizeRef?.height ?? 0)
              })
              setIsMaximized(newValue)
              if (newValue) {
                floaty.onOpen?.()
              }
              else {
                floaty.onClose?.()
              }
            }}
          />
        </Tooltip>, expandType !== ExpandType.None)}
      <Tooltip isDisabled label={`Change to ${isLowRes ? 'high-res' : 'low-res'} `}>
        <Button
          isDisabled
          iconSpacing={0}
          leftIcon={
            !isLowRes ? (
              <IconBadgeHd />
            ) : (
              <IconBadgeSd />
            )
          }
          variant={'ghost'}
          onClick={() => setIsLowRes(!isLowRes)}
        />
      </Tooltip>
    </Box>)}
  </>
}
