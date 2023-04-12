import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text } from '@mantine/core'
import { LiveDataContainer } from '@/components'

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
  backgroundColor: 'darkred',
  borderRadius: 10,
  marginBottom: 20
}

export default function Index({ model }: InferGetStaticPropsType<typeof getStaticProps>) {

  return <>
    <Container sx={{ ...defaultStyle }}>
      <Text>
        Live data container
        <LiveDataContainer component={<>
        </>} />
      </Text>
    </Container>
    <Container sx={{ ...defaultStyle }}>
      <Text>
        Provider data container
      </Text>
    </Container>
    <Container sx={{ ...defaultStyle }}>
      <Text>
        Provider chart container
      </Text>
    </Container>
  </>
}
