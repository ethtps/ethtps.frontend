import { Flex, Link, Stack, Tooltip } from '@chakra-ui/react'
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconBrandTwitter
} from '@tabler/icons-react'
import { useColors } from '../../../ethtps.components'

export function ThreeLinks() {
  const color = {
    color: useColors().text
  }
  return (
    <>
      <Flex alignItems={'center'}>
        <Stack direction={'row'} spacing={7} alignItems={'center'}>
          <Stack direction={'row'} spacing={7} alignItems={'center'}>
            <Link href={'https://twitter.com/ethtps'}>
              <Tooltip label='Follow us on Twitter' aria-label='twitter-button'>
                <IconBrandTwitter {...color} />
              </Tooltip>
            </Link>
            <Link href={'https://discord.gg/jWPcsTzpCT'}>
              <Tooltip
                label='Join our Discord channel'
                aria-label='discord-button'>
                <IconBrandDiscord size={'20px'} {...color} />
              </Tooltip>
            </Link>
            <Link href={'https://github.com/orgs/ethtps/repositories'}>
              <Tooltip label='GitHub repo' aria-label='twitter-button'>
                <IconBrandGithub size={'20px'} {...color} />
              </Tooltip>
            </Link>
          </Stack>
        </Stack>
      </Flex>
    </>
  )
}
