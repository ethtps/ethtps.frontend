import {
  useMantineColorScheme,
  ActionIcon,
  Group,
  Tooltip,
  ColorScheme
} from '@mantine/core'
import { IconSun, IconMoonStars } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  return (
    <Tooltip withArrow label={`Change theme [CTRL+J]`}>
      <ActionIcon
        onClick={() => toggleColorScheme()}
        size='lg'
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === 'dark'
              ? theme.colors.yellow[4]
              : theme.colors.blue[6]
        })}
        style={{ float: 'right' }}>
        {colorScheme === 'dark' ? (
          <IconSun size='1.2rem' />
        ) : (
          <IconMoonStars size='1.2rem' />
        )}
      </ActionIcon>
    </Tooltip>
  )
}
