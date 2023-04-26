import { AppShell, Footer, Group, Text, Tooltip } from '@mantine/core'
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord
} from '@tabler/icons-react'
import { GetStaticProps } from 'next'
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link'
import CustomFooter from './CustomFooter'
import HeaderWithTabs from './HeaderWithTabs'
import CustomNavbar from './CustomNavbar'
import { createHandlerFromCallback, useHandler } from '@/data'
import { useState } from 'react'
import { useDisclosure } from '@mantine/hooks'

export const getStaticProps: GetStaticProps<{}> = async (context) => {
  return {
    props: {}
  }
}

export default function MainLayout(props: { component: JSX.Element }) {
  const [opened, { toggle }] = useDisclosure(false)
  return (
    <>
      <AppShell
        navbarOffsetBreakpoint='md'
        asideOffsetBreakpoint='md'
        sx={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
        header={
          <HeaderWithTabs
            open={opened}
            burgerToggled={toggle}
            links={[
              {
                link: 'https://github.com/orgs/ethtps/repositories',
                label: 'GitHub',
                icon: <IconBrandGithub size={'1.2rem'} />
              },
              {
                link: 'https://twitter.com/ethtps',
                label: 'Follow us on Twitter',
                icon: <IconBrandTwitter size={'1.2rem'} />
              },
              {
                link: 'https://discord.gg/jWPcsTzpCT',
                label: 'Join our Discord channel',
                icon: <IconBrandDiscord size={'1.2rem'} />
              }
            ]}
          />
        }
        navbar={
          <CustomNavbar opened={opened} />
        }
        footer={
          <CustomFooter />
        }>
        {props.component}
      </AppShell>
    </>
  )
}
