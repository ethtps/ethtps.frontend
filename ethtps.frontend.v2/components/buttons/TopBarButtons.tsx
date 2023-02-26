import { Fragment } from 'react'
import { IconButtonWithTooltip } from './with-tooltip/IconButtonWithTooltip'
import { BrandDiscord, BrandGithub, BrandTwitter } from 'tabler-icons-react'
import { Box } from '@mantine/core'
import { ThemeButton } from './ThemeButton'

export function TopBarButtons() {
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
        <ThemeButton />
      </Box>
    </Fragment>
  )
}
