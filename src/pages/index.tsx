import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text } from '@mantine/core'
import CustomVISXStreamgraph from '@/components/instant data animations/CustomVISXStreamgraph'
import { useEffect, useRef, useState } from 'react'
import { ConveyorBelt, Thwrapper } from '@/components'

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
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef<any>(null)
  useEffect(() => {
    setContainerWidth(
      containerRef.current ? containerRef.current.offsetWidth : 0
    )
  }, [containerRef])
  return <>
    <Container ref={containerRef} sx={{ ...defaultStyle }}>
      <Thwrapper component={<ConveyorBelt width={containerWidth} height={500} />} />
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
