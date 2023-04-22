import ReactMarkdown from 'react-markdown'
import { Container } from '@mantine/core'

interface IMarkdownEditorProps {
  markdown: string
}

export default function MarkdownEditor(props: IMarkdownEditorProps) {
  return (
    <>
      <Container>
        <ReactMarkdown>{props.markdown}</ReactMarkdown>,
      </Container>
    </>
  )
}
