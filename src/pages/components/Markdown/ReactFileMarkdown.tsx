import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import { MarkdownEditor } from "./MarkdownEditor";



export default function ReactFileMarkdown(props: { fileName: string }) {
    const [markdown, setMarkdown] = useState("")
    useEffect(() => {
        async function fetchMarkdown() {
            const response = await fetch(`/markdown/${props.fileName}`);
            const text = await response.text();
            setMarkdown(text);
        }
        fetchMarkdown();
    }, [props.fileName])
    return <>
        <MarkdownEditor markdown={markdown} />
    </>
}