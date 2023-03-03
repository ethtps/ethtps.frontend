import { Fragment } from 'react'
import { IIconButtonWithTooltipProps } from './IIconButtonWithTooltipProps'
import { NavLink, Tooltip } from '@mantine/core'

export function IconButtonWithTooltip(props: IIconButtonWithTooltipProps) {
  return (
    <Fragment>
      <Tooltip label={props.tooltipMessage}>
        <NavLink
          component="a"
          href={props.link}
          icon={<>{<props.icon color={props.color} fill={props.fill} />}</>}
        />
      </Tooltip>
    </Fragment>
  )
}
