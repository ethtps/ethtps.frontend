import { AppShell } from '@mantine/core'
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord
} from '@tabler/icons-react'
// eslint-disable-next-line import/no-internal-modules
import CustomFooter from './CustomFooter'
import HeaderWithTabs from './HeaderWithTabs'
import CustomNavbar from './CustomNavbar'
import { useDisclosure } from '@mantine/hooks'
import { ProviderResponseModel } from '@/api-client'
import DataLoader from '../DataLoader'

export default function MainLayout(props: Partial<{
  component: JSX.Element,
  allProviders: ProviderResponseModel[]
}>) {
  const [opened, { toggle }] = useDisclosure(false)
  return (
    <>
      <DataLoader />
      <AppShell
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
          <CustomNavbar opened={opened} allProviders={props.allProviders} />
        }
        footer={
          <CustomFooter />
        }>
        {props.component}
      </AppShell>
    </>
  )
}
