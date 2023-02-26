import { useMantineTheme } from '@mantine/core'
import { Moon, SunHigh } from 'tabler-icons-react'

export enum Theme {
  Light = 'light',
  Dark = 'dark'
}

export const getTheme = (): Theme =>
  useMantineTheme().colorScheme === 'dark' ? Theme.Dark : Theme.Light
export const isLightTheme = (): boolean => getTheme() === Theme.Light
export const getThemeIcon = (theme: string) =>
  theme === 'light' ? <Moon /> : <SunHigh />
