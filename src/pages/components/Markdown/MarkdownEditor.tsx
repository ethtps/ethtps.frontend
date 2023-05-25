import ReactMarkdown from 'react-markdown'
import { Container } from '@chakra-ui/react'

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
