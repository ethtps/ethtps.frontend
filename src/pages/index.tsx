/* eslint-disable react/jsx-no-undef */
import { Container } from '@mantine/core'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Text, Notification } from '@mantine/core'
import React from 'react'
import { AllProvidersTable, AnimationSelector, useSizeRef } from '../components'
import { useAppSelector } from '../data'
import { getAPIKey } from '../services'

type IndexPageModel = {
  providers: string[]
}

export const getStaticProps: GetStaticProps<{ model: IndexPageModel }> = (
  context
) => {
  return {
    props: {
      model: {
        providers: ['Ethereum']
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
  backgroundColor: 'darkred'
}

export default function Index({
  model
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const sizeRef = useSizeRef()
  const providerCount = useAppSelector((x) => x.providers?.length)
  return (
    <>
      <Container ref={sizeRef.ref} style={{ height: 500 }}>
        <AnimationSelector width={sizeRef.width} height={sizeRef.height} />
      </Container>
      <br />
      <Container></Container>
      <Container style={{ ...defaultRedStyle }}>
        <Text>Provider data container</Text>
      </Container>
      <Container style={{ ...defaultRedStyle }}>
        <Text>
          Provider chart container
          <AllProvidersTable width={sizeRef.width ?? 0} />
        </Text>
      </Container>
      <Notification title='Debug info'>
        <Text>API key: {getAPIKey()}</Text>
        <Text>
          Providers: {providerCount === undefined ? 'none' : providerCount}
        </Text>
      </Notification>
    </>
  )
}
