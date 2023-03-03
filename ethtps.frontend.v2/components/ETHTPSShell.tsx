import { ReactNode, useState } from 'react'
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  Grid
} from '@mantine/core'
import { Logo } from './header/Logo'
import { TopBarButtons } from './buttons/TopBarButtons'
import { useThemeColors } from '../theming/ThemeHooks'
import { SignatureFooter } from './footer/SignatureFooter'

export default function ETHTPSShell(props: { children: ReactNode }) {
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
      footer={<SignatureFooter />}
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
      {props.children}
    </AppShell>
  )
}
