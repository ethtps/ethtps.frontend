'use client'
import { Container, Group, Paper } from '@mantine/core'
// eslint-disable-next-line import/no-internal-modules
import ReactFileMarkdown from './components/Markdown/ReactFileMarkdown'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { queryClient } from '@/services'

export default function PrivacyPolicy() {
  const [markdown, setMarkdown] = useState('Loading...')
  useEffect(() => {
    queryClient.fetchQuery('privacy-policy', async () => await fetch('/markdown/PrivacyPolicy.md')
      .then((response) => {
        response.text().then((text) => {
          if (text) {
            setMarkdown(text)
          }
          else {
            setMarkdown('Error loading page')
          }
        })
      }))
  }, [])
  return (
    <>
      <Container>
        <Paper withBorder sx={{
          padding: '3rem',
          margin: '1rem',
          height: '90%',
        }}>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </Paper>
      </Container>
    </>
  )
}
