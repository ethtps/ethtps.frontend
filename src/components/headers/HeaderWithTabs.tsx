// eslint-disable-next-line import/no-internal-modules
import styles from '../../styles/app.module.scss'
import { useState } from 'react'
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  Text,
  Tooltip,
  ActionIcon
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
// eslint-disable-next-line import/no-internal-modules
import Link from 'next/link'

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%'
  },

  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none'
    }
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none'
    }
  },

  link: {
    display: 'block',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0]
    }
  },

  linkActive: {
    '&, &:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color
    }
  }
}))

interface HeaderSimpleProps {
  links: { link: string; label: string; icon: JSX.Element }[]
}

export function HeaderWithTabs({ links }: HeaderSimpleProps) {
  const [opened, { toggle }] = useDisclosure(false)
  const [active, setActive] = useState(links[0].link)
  const { classes, cx } = useStyles()
  const items = links.map((link) => (
    <ActionIcon size={'xl'} key={link.link}>
      <Tooltip label={link.label} withArrow position={'bottom'}>
        <a href={link.link}>{link.icon}</a>
      </Tooltip>
    </ActionIcon>
  ))

  return (
    <Header height={60} mb={120}>
      <Container className={classes.header}>
        <Link href='/'>
          <Text className={styles.logoish}>ETHTPS.info</Text>
        </Link>
        <Container
          style={{
            marginRight: 0
          }}>
          <Group
            spacing={0}
            className={classes.links}
            position='center'
            my='xl'>
            {items}
            {/*<ThemeToggle />*/}
          </Group>
        </Container>
        <Burger
          opened={true}
          onClick={toggle}
          className={classes.burger}
          size='sm'
        />
      </Container>
    </Header>
  )
}
