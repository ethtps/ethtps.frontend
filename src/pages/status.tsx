import { Link } from '@chakra-ui/next-js'
import {
  Button,
  Container,
  Flex,
  Heading,
  Text,
  useBoolean
} from '@chakra-ui/react'
import { ETHTPSDataCoreModelsResponseModelsProviderResponseModel } from 'ethtps.api'
import { GetServerSideProps } from 'next'
import {
  AllProvidersStatusTable,
  ProviderRequestDialog,
  useColors
} from '../ethtps.components'
import { api } from '../services'

interface IStatusProps {
  providerData: ETHTPSDataCoreModelsResponseModelsProviderResponseModel[]
}

export const getStaticProps: GetServerSideProps = async (context) => {
  const providers = await api.getProvidersAsync()
  return {
    props: {
      providerData: providers
    }
  }
}

export default function Status({ providerData }: IStatusProps) {
  const colors = useColors()
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
          <Link
            sx={{
              textDecoration: 'underline',
              borderRadius: 'md',
              padding: '1px',
              bgColor: colors.gray1,
              color: colors.textContrast,
              marginLeft: '0.2rem',
              _visited: {
                color: colors.textContrast,
                textDecoration: 'underline'
              },
              _hover: {
                bgColor: colors.gray1
              }
            }}
            href={
              'https://github.com/ethtps/ethtps.backend/tree/dev/ETHTPS.Services.Ethereum'
            }>
            this page
          </Link>
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
