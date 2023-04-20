import { Container } from '@mantine/core'
// eslint-disable-next-line import/no-internal-modules
import ReactFileMarkdown from './components/Markdown/ReactFileMarkdown'

export default function PrivacyPolicy() {
  return (
    <>
      <Container>
        <ReactFileMarkdown fileName='PrivacyPolicy.md' />
      </Container>
    </>
  )
}
