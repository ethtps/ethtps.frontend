import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import MarkdownEditor from './MarkdownEditor'
import { GetStaticProps, InferGetStaticPropsType } from 'next'

type MarkdownPageModel = {
  markdown?: string | null,
  fileName?: string | null
}

export const getStaticProps: GetStaticProps<{ model: MarkdownPageModel }> = async (
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

export default function ReactFileMarkdown(props: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <MarkdownEditor markdown={props?.model?.markdown ?? "Error loading page"} />
    </>
  )
}
