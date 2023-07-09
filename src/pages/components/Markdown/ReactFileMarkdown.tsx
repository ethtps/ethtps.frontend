// eslint-disable-next-line import/no-internal-modules
// import * as mdx from 'mdx/types'
import { GetStaticProps, InferGetStaticPropsType } from 'next'
import MarkdownEditor from './MarkdownEditor'

type MarkdownPageModel = {
  markdown?: string | null
  fileName?: string | null
}

const getStaticProps: GetStaticProps<{ model: MarkdownPageModel }> = async (
  context
) => {
  const markdown = await fetch(`/markdown/${context.params?.fileName}`)
  return {
    props: {
      model: {
        markdown: await markdown.text()
      } as MarkdownPageModel
    },
    revalidate: 60
  }
}

export default function ReactFileMarkdown(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <>
      <MarkdownEditor
        markdown={props?.model?.markdown ?? 'Error loading page'}
      />
    </>
  )
}
