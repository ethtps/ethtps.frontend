import { Moon, SunHigh } from 'tabler-icons-react'
import { isLightTheme } from './ThemeHelper'
import { useMantineTheme } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useColorScheme } from '@mantine/hooks'

export const useThemeIcon = () => (isLightTheme() ? <Moon /> : <SunHigh />)
export const useThemeColors = () => {
  const theme = useMantineTheme()
  const [colors, setColors] = useState(theme.colors)
  useEffect(() => {
    setColors(theme.colors)
  }, [theme.colorScheme])
  return colors
}
