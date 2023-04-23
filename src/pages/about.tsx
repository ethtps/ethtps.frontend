import React, { useState } from 'react'
import { Container } from '@mantine/core'
// eslint-disable-next-line import/no-internal-modules
import ReactFileMarkdown from './components/Markdown/ReactFileMarkdown'

export default function About() {
  return (
    <>
      <Container>
        <ReactFileMarkdown model={{ fileName: "About.md" }} />
      </Container>
    </>
  )
}
