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
import { SocialMediaTopBarLinks } from './SocialMediaTopBarLinks'
import { SignatureFooter } from './footer/SignatureFooter'
export default function ETHTPSShell() {
  const theme = useMantineTheme()
  const [opened, setOpened] = useState(false)
  const colorScheme = useColorScheme()

  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0]
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
                color={theme.colors.gray[6]}
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
              <SocialMediaTopBarLinks />
            </Grid>
          </div>
        </Header>
      }
    >
      <Text>Resize app to see responsive navbar in action</Text>
    </AppShell>
  )
}