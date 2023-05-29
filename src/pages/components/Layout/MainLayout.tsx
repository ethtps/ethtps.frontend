'use client'
// eslint-disable-next-line import/no-internal-modules
import { useDisclosure } from '@mantine/hooks'
import { ProviderResponseModel } from '@/api-client'
import Navbar from './Navbar'

export default function MainLayout(props: Partial<{
  component: JSX.Element,
  allProviders: ProviderResponseModel[]
}>) {
  const [opened, { toggle }] = useDisclosure(false)

  return (
    <>
      <Navbar allProviders={props.allProviders} />
      {props.component}
    </>
  )
}
