import { Fragment } from 'react'
import { IconButtonWithTooltip } from './buttons/with-tooltip/IconButtonWithTooltip'
import { BrandDiscord, BrandGithub, BrandTwitter } from 'tabler-icons-react'
import { Box } from '@mantine/core'

export function SocialMediaTopBarLinks() {
  return (
    <Fragment>
      <Box
        sx={{
          display: 'flex',
          float: 'right'
        }}
      >
        <IconButtonWithTooltip
          icon={BrandDiscord}
          link="https://discord.gg/jWPcsTzpCT"
          tooltipMessage="Join our Discord channel"
          color="#7289da"
          fill="transparent"
        />
        <IconButtonWithTooltip
          icon={BrandTwitter}
          link="https://twitter.com/ethtps"
          tooltipMessage="Twitter page"
          color="#00ACEE"
          fill="#00ACEE"
        />
        <IconButtonWithTooltip
          icon={BrandGithub}
          link="https://github.com/ethtps"
          tooltipMessage="GitHub"
        />
      </Box>
    </Fragment>
  )
}
