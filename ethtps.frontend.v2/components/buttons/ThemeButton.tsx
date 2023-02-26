import {
  ActionIcon,
  NavLink,
  ThemeIcon,
  Tooltip,
  useMantineTheme
} from '@mantine/core'
import { Fragment, useCallback, useEffect, useState } from 'react'
import { SunHigh } from 'tabler-icons-react'
import { getThemeIcon } from '../../theming/ThemeHelper'
import { useThemeIcon } from '../../theming/ThemeHooks'
import { useColorScheme } from '@mantine/hooks'

export function ThemeButton() {
  const theme = useMantineTheme()
  const [icon, setIcon] = useState(useThemeIcon())
  const [themeName, setThemeName] = useState(theme.colorScheme)

  const swapTheme = () => {
    setThemeName(themeName === 'dark' ? 'light' : 'dark')
    setIcon(getThemeIcon(theme.colorScheme))
  }
  useColorScheme(themeName)
  return (
    <Fragment>
      <Tooltip
        children={<NavLink onClick={swapTheme} icon={icon} />}
        label={'Change theme'}
      />
    </Fragment>
  )
}
