
import { AdminAPIWrapper } from '@/ethtps.data'
import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useBoolean,
  useToast
} from '@chakra-ui/react'
import { IconEye } from '@tabler/icons-react'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel, ETHTPSDataIntegrationsMSSQLProviderType } from 'ethtps.api'
import { GetServerSideProps } from 'next'
import { useEffect } from 'react'
import {
  AllProvidersStatusTable,
  ProviderRequestDialog,
  openNewTab,
  useColors
} from '../ethtps.components'
import { api } from '../services'

interface IStatusProps {
  providerData: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
  providerTypes: ETHTPSDataIntegrationsMSSQLProviderType[]
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const types = await AdminAPIWrapper.DEFAULT.getAllProviderTypesAsync()
  const providers = await api.getProvidersAsync()
  return {
    props: {
      providerData: providers,
      providerTypes: types
    }
  }
}

export default function Status({ providerData, providerTypes }: IStatusProps) {
  const colors = useColors()
  const toast = useToast()
  useEffect(() => {
    setTimeout(() => {
      toast({
        title: <>
          <Text
            onClick={() => openNewTab('https://github.com/ethtps/ethtps.backend/blob/dev/ETHTPS.Services.Ethereum/README.md')}
            sx={{
              cursor: 'pointer',
              _hover: {
                textDecoration: 'underline'
              }
            }}>Want to help?</Text>
        </>,
        position: 'bottom-right',
        icon: <IconEye></IconEye>,
        duration: 60000,
        isClosable: true,
      })
    }, 10000)
  }, [])
  const showSubmissionDialog = useBoolean(false)
  return (
    <>
      <Container maxW={'container.lg'}>
        <br />
        <Heading textAlign={'center'} color={colors.text} size={'md'}>
          Updater state and overall status for all providers
        </Heading>
        <br />
        <Text textIndent={'1rem'} color={colors.text}>
          {
            "The table below shows the current state of all live data providers and their overall historical sync status. Some are missing implementation - we're working on it."
          }
        </Text>
        <Text textIndent={'1rem'} color={colors.text}>
          If you want to help the project and the community, take a look at

          <a style={{
            textDecoration: 'underline',
            borderRadius: 'md',
            padding: '1px',
            color: colors.text,
            marginLeft: '0.2rem',
          }} href={
            'https://github.com/ethtps/ethtps.backend/tree/dev/ETHTPS.Services.Ethereum'
          }>this page</a>
          . Any help is greatly appreciated :)
        </Text>
        <br />
        <Heading textIndent={'1rem'} color={colors.text} size={'md'}>
          Missing provider?
        </Heading>
        <br />
        <Flex alignItems={'center'}>
          <Text className={'inline'} textIndent={'1rem'} color={colors.text}>
            Contact us on social media (links at the top) or
          </Text>
          <Button
            onClick={() => showSubmissionDialog[1].on()}
            className={'inline'}
            variant={'unstyled'}
            sx={{
              textColor: colors.textContrast,
              backgroundColor: colors.gray2,
              _hover: {
                bgColor: colors.gray1
              },
              marginLeft: '0.2rem',
              padding: '0.4rem'
            }}>
            submit a request
          </Button>
          <ProviderRequestDialog
            api={api}
            networkTypes={providerTypes}
            isOpen={showSubmissionDialog[0]}
            onClose={() => showSubmissionDialog[1].off()}
          />
        </Flex>
      </Container>
      <br />
      <Container maxW={'container.lg'}>
        <AllProvidersStatusTable
          maxRowsBeforeShowingExpand={50}
          providerData={providerData}
        />
      </Container>
    </>
  )
}
