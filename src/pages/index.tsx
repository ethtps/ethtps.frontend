/* eslint-disable import/no-internal-modules */
import { Box, Center, Stack } from '@chakra-ui/react'
import { AllProvidersTable, LivePSPartial } from '@/components'
import { Suspense, useRef, useState } from 'react'
import { useSize } from "@chakra-ui/react-use-size"
import Loading from './components/Loading'
import { GetServerSideProps } from 'next'
import { ProviderResponseModel } from '@/api-client'
import { getAsync } from '@/services'

interface IIndexPageProps {
  providerData?: ProviderResponseModel[]
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  return {
    props: {
      providerData: providers.parsedBody
    } as ProviderResponseModel
  }
}

export default function Index({ providerData }: IIndexPageProps) {
  const containerRef = useRef<any>(null)
  const sizeRef = useSize(containerRef)
  const [currentValue, setCurrentValue] = useState(0)
  return (
    <>
      <Box w={'100%'} ref={containerRef}>
        <LivePSPartial
          value={currentValue}
          width={Math.max(sizeRef?.width ?? 500, 750)}
        />
      </Box>
      <br />
      <Center>
        <Stack boxSize={'container.xl'}>
          <AllProvidersTable providerData={providerData} maxRowsBeforeShowingExpand={25} />
        </Stack>
      </Center>
    </>
  )
}