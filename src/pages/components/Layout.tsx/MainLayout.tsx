import { HeaderWithTabs } from '@/components'
import { AppShell, Footer, Group, Text, Tooltip } from '@mantine/core'
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandDiscord
} from '@tabler/icons-react'
import { GetStaticProps } from 'next'
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link'

export const getStaticProps: GetStaticProps<{}> = async (context) => {
  return {
    props: {}
  }
}

export default function MainLayout(props: { component: JSX.Element }) {
  return (
    <>
      <AppShell
        navbarOffsetBreakpoint='sm'
        asideOffsetBreakpoint='sm'
        footer={
          <Footer height={50}>
            <Group style={{ marginTop: 0 }} position='apart'>
              <div>
                <Text className={'inline'} size={'sm'}>
                  Brought to you by
                </Text>
                <Text className={'inline'} size={'sm'}>
                  <div style={{ marginLeft: '5px' }} className={'trick'}>
                    <span className='animated-cell'>Mister_Eth</span>
                  </div>
                </Text>
              </div>
              <div style={{ float: 'right' }}>
                <Group>
                  <Link href={'/about'}>
                    <Text size={'sm'}>About</Text>
                  </Link>
                  <Link href={'/privacy-policy'}>
                    <Text size={'sm'}>Privacy policy</Text>
                  </Link>
                  <Link href={'https://ethtps.info?ref=v2_alpha'}>
                    <Text size={'sm'}>Old version</Text>
                  </Link>
                  <Tooltip
                    label={"First alpha version. Don't expect too much :)"}>
                    <Text className={'unselectable'} size={'xs'}>
                      v1.5.0a1
                    </Text>
                  </Tooltip>
                </Group>
              </div>
            </Group>
          </Footer>
        }
        header={
          <HeaderWithTabs
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
        }>
        {props.component}
      </AppShell>
    </>
  )
}
