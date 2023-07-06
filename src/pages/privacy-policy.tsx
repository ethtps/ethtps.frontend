'use client'
import { Container } from '@chakra-ui/react'
// eslint-disable-next-line import/no-internal-modules
import { PrivacyPolicyMarkdown } from './markdown'

export default function PrivacyPolicy() {
  return (
    <>
      <Container>
        <PrivacyPolicyMarkdown />
      </Container>
    </>
  )
}
