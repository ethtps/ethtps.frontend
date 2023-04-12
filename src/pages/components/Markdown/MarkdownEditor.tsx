import { useState } from "react";
import ReactMarkdown from "react-markdown"
import { ContentState, Editor, EditorState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { binaryConditionalRender, conditionalRender } from "@/services/Types";
import { Button, Container } from "@mantine/core";
import { IconAlien, IconEdit } from "@tabler/icons-react";

interface IMarkdownEditorProps {
    markdown: string
}

export function MarkdownEditor(props: IMarkdownEditorProps) {
    const [editorState, setEditorState] = useState(
        () => EditorState.createWithContent(ContentState.createFromText(props.markdown)),
    );
    const [editMode, setEditMode] = useState(false);
    return <>
        <Container>
            <Button onClick={() => setEditMode(!editMode)}>
                {binaryConditionalRender(<IconEdit />, <IconAlien />, !editMode)}
            </Button>
            {binaryConditionalRender(<Editor editorState={editorState} onChange={setEditorState} />,
                <ReactMarkdown>
                    {editorState.getCurrentContent().getPlainText()}
                </ReactMarkdown>, editMode)}
        </Container>
    </>
}