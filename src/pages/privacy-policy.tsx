'use client'
import { Container, Stack } from '@chakra-ui/react'
// eslint-disable-next-line import/no-internal-modules
import ReactFileMarkdown from './components/Markdown/ReactFileMarkdown'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { queryClient } from '@/services'
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
