'use client'
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
import { Stack } from '@chakra-ui/react'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import { Navbar } from './'

export default function MainLayout(props: Partial<{
  component: JSX.Element,
  allProviders: ProviderResponseModel[]
}>) {
  const [opened, { toggle }] = useDisclosure(false)
  return (
    <>
      <Navbar />
      {props.component}
    </>
  )
}
