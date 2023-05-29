/* eslint-disable import/no-internal-modules */
import { Alert, AlertIcon, Box, Center, Stack } from '@chakra-ui/react'
import { ProviderResponseModel } from '@/api-client'
import { AllProvidersTable, LivePSPartial } from '@/components'
import { useRef, useState } from 'react'
import { useSize } from "@chakra-ui/react-use-size"
import { getAsync } from '@/services'
import { GetServerSideProps } from 'next'


interface IIndexPageModel {
  providers?: ProviderResponseModel[]
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const providers = await getAsync<ProviderResponseModel[]>(`${process.env.REACT_APP_API_DEV_GENERAL_ENDPOINT}/api/v2/Providers?includeSidechains=true&XAPIKey=${process.env.REACT_APP_FRONTEND_API_KEY}`)
  return {
    props: {
      providers: providers.parsedBody
    } as IIndexPageModel
  }
}

export default function Index(props: IIndexPageModel) {
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
          {props.providers && props.providers.length > 0 ? (
            <AllProvidersTable maxRowsBeforeShowingExpand={25} providerData={props.providers} />
          ) : (
            <Alert status='error'>
              <AlertIcon />
              Error loading data. Try refreshing the page.
            </Alert>
          )}
        </Stack>
      </Center>
    </>
  )
}