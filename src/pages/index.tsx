import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text, Notification } from '@mantine/core'
import { AnimationSelector, ConveyorBelt, FramerBar, Thwrapper, useSizeRef } from '@/components'
import { getAPIKey } from '@/services/DependenciesIOC'

type IndexPageModel = {
  providers: string[]
}

export const getStaticProps: GetStaticProps<{ model: IndexPageModel }> = (
  context
) => {
  return {
    props: {
      model: {
        providers: ["Ethereum"]
      } as IndexPageModel
    },
    revalidate: 5
  }
}

const defaultStyle = {
  height: 400,
  borderRadius: 10,
  marginBottom: 20
}

const defaultRedStyle = {
  ...defaultStyle,
  backgroundColor: 'darkred',
}

export default function Index({ model }: InferGetStaticPropsType<typeof getStaticProps>) {
  const sizeRef = useSizeRef()
  return <>
    <Container ref={sizeRef.ref} style={{ height: 500 }}>
      <AnimationSelector width={sizeRef.width} height={sizeRef.height} />
    </Container>
    <br />
    <Container style={{ ...defaultRedStyle }}>
      <Text>
        Provider data container
      </Text>
    </Container>
    <Container style={{ ...defaultRedStyle }}>
      <Text>
        Provider chart container
      </Text>
    </Container>
    <Notification title="Debug info">
      <Text>
        API key: {getAPIKey()}
      </Text>
    </Notification>
  </>
}
