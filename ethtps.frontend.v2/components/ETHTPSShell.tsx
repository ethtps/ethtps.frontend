import { useState } from 'react'
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Center,
  Anchor,
  Box,
  NavLink,
  ThemeIcon,
  Container,
  Flex,
  Stack,
  Grid
} from '@mantine/core'
import { IconArrowLeft, IconPhoto } from '@tabler/icons'
import { useColorScheme } from '@mantine/hooks'
import { Logo } from 'ethtps.components'
import { TopBarButtons } from './buttons/TopBarButtons'
import { SignatureFooter } from './footer/SignatureFooter'
import { ThemeButton } from './buttons/ThemeButton'
import { useThemeColors } from '../theming/ThemeHooks'
export default function ETHTPSShell() {
  const colors = useThemeColors()
  const [opened, setOpened] = useState(false)
  return (
    <AppShell
      styles={{
        main: {
          background: 'white'
        }
      }}
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <Text>Sidebar sits here</Text>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <SignatureFooter />
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <Logo />
            <Grid
              justify={'flex-end'}
              sx={{
                width: '100%'
              }}
            >
              <TopBarButtons />
            </Grid>
          </div>
        </Header>
      }
    >
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  )
}
