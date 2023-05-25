// eslint-disable-next-line import/no-internal-modules
import styles from '../../../styles/app.module.scss'
import { useCallback, useState } from 'react'
import {
  Button,
  Container,
  Stack,
  Text,
  Tooltip
} from '@chakra-ui/react'
import { useDisclosure } from '@mantine/hooks'
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link'

interface HeaderSimpleProps {
  links: { link: string; label: string; icon: JSX.Element }[]
  burgerToggled: () => void
  open: boolean
}

export default function HeaderWithTabs({
  links,
  burgerToggled,
  open
}: HeaderSimpleProps) {
  const [active, setActive] = useState(links[0].link)

  const items = useCallback(() => links.map((link) => (
    <>
      <Tooltip label={link.label} hasArrow placement={'bottom'}>
        <a href={link.link}>{link.icon}</a>
      </Tooltip>
    </>
  )), [links])

  return (
    <header>
      <Container>
        <Link href='/'>
          <Text className={styles.logoish}>ETHTPS.info</Text>
        </Link>
        <Container
          style={{
            marginRight: 0
          }}>
          <Stack
            spacing={0}
            placeContent='center'
            my='xl'>
            {items()}
          </Stack>
        </Container>
        <Button
          hidden={false}
          onClick={burgerToggled}
          size='sm'
        />
      </Container>
    </header>
  )
}
