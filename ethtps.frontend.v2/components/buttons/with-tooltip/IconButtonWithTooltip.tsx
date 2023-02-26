import { Fragment } from 'react'
import { IIconButtonWithTooltipProps } from './IIconButtonWithTooltipProps'
import { IconPhoto } from '@tabler/icons'
import { NavLink, ThemeIcon, Tooltip } from '@mantine/core'
import { BrandDiscord } from 'tabler-icons-react'

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
