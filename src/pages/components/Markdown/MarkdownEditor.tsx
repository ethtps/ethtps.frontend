import { useState } from "react";
import ReactMarkdown from "react-markdown"
import { binaryConditionalRender, conditionalRender } from "@/services";
import { Button, Container } from "@mantine/core";
import { IconAlien, IconEdit } from "@tabler/icons-react";
import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';

interface IMarkdownEditorProps {
    markdown: string
}

export function MarkdownEditor(props: IMarkdownEditorProps) {
    const [md, setMd] = useState(props.markdown);
    const [editMode, setEditMode] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Superscript,
            SubScript,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content: md,
        onUpdate: ({ editor }) => {
            setMd(editor.getHTML())
        }
    });
    return <>
        <Container>
            <Button onClick={() => setEditMode(!editMode)}>
                {binaryConditionalRender(<IconEdit />, <IconAlien />, !editMode)}
            </Button>
            {binaryConditionalRender(<RichTextEditor editor={editor}>
                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Underline />
                        <RichTextEditor.Strikethrough />
                        <RichTextEditor.ClearFormatting />
                        <RichTextEditor.Highlight />
                        <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.H1 />
                        <RichTextEditor.H2 />
                        <RichTextEditor.H3 />
                        <RichTextEditor.H4 />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Blockquote />
                        <RichTextEditor.Hr />
                        <RichTextEditor.BulletList />
                        <RichTextEditor.OrderedList />
                        <RichTextEditor.Subscript />
                        <RichTextEditor.Superscript />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Link />
                        <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                        <RichTextEditor.AlignLeft />
                        <RichTextEditor.AlignCenter />
                        <RichTextEditor.AlignJustify />
                        <RichTextEditor.AlignRight />
                    </RichTextEditor.ControlsGroup>
                </RichTextEditor.Toolbar>

                <RichTextEditor.Content />
            </RichTextEditor>,
                <ReactMarkdown>
                    {md}
                </ReactMarkdown>, editMode)}
        </Container>
    </>
}