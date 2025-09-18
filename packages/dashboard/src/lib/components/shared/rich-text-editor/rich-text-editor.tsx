import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useLayoutEffect, useRef } from 'react';
import { EditorToolbar } from './editor-toolbar.js';

const extensions = [
    TextStyle.configure(),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-primary underline underline-offset-2 cursor-pointer hover:text-primary/80',
        },
        validate: (href) => /^https?:\/\//.test(href),
    }),
    Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
            class: 'rich-text-image',
        },
    }),
];

export interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

export function RichTextEditor({ value, onChange, disabled = false }: RichTextEditorProps) {
    const isInternalUpdate = useRef(false);

    const editor = useEditor({
        parseOptions: {
            preserveWhitespace: 'full',
        },
        extensions: extensions,
        content: value,
        editable: !disabled,
        onUpdate: ({ editor }) => {
            if (!disabled) {
                isInternalUpdate.current = true;
                console.log('onUpdate');
                const newValue = editor.getHTML();
                if (value !== newValue) {
                    onChange(newValue);
                }
            }
        },
        editorProps: {
            attributes: {
                class: `rich-text-editor placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content min-h-16 w-full bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-h-[500px] overflow-y-auto ${disabled ? 'cursor-not-allowed opacity-50' : ''}`,
            },
        },
    });

    useLayoutEffect(() => {
        if (editor && !isInternalUpdate.current) {
            const currentContent = editor.getHTML();
            if (currentContent !== value) {
                const { from, to } = editor.state.selection;
                editor.commands.setContent(value, false);
                editor.commands.setTextSelection({ from, to });
            }
        }
        isInternalUpdate.current = false;
    }, [value, editor]);

    useLayoutEffect(() => {
        if (editor) {
            editor.setEditable(!disabled, false);
        }
    }, [disabled, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-md overflow-hidden">
            <EditorToolbar editor={editor} disabled={disabled} />
            <EditorContent editor={editor} />
            <style>{`
                .rich-text-editor h1 {
                    font-size: 2em;
                    font-weight: 700;
                    margin-top: 0.67em;
                    margin-bottom: 0.67em;
                    line-height: 1.2;
                }
                .rich-text-editor h2 {
                    font-size: 1.5em;
                    font-weight: 600;
                    margin-top: 0.83em;
                    margin-bottom: 0.83em;
                    line-height: 1.3;
                }
                .rich-text-editor h3 {
                    font-size: 1.17em;
                    font-weight: 600;
                    margin-top: 1em;
                    margin-bottom: 1em;
                    line-height: 1.4;
                }
                .rich-text-editor h4 {
                    font-size: 1em;
                    font-weight: 600;
                    margin-top: 1.33em;
                    margin-bottom: 1.33em;
                    line-height: 1.4;
                }
                .rich-text-editor h5 {
                    font-size: 0.83em;
                    font-weight: 600;
                    margin-top: 1.67em;
                    margin-bottom: 1.67em;
                    line-height: 1.5;
                }
                .rich-text-editor h6 {
                    font-size: 0.67em;
                    font-weight: 600;
                    margin-top: 2.33em;
                    margin-bottom: 2.33em;
                    line-height: 1.6;
                }
                .rich-text-editor p {
                    margin-top: 0;
                    margin-bottom: 1em;
                    line-height: 1.6;
                }
                .rich-text-editor strong,
                .rich-text-editor b {
                    font-weight: 700;
                }
                .rich-text-editor em,
                .rich-text-editor i {
                    font-style: italic;
                }
                .rich-text-editor s,
                .rich-text-editor del,
                .rich-text-editor strike {
                    text-decoration: line-through;
                }
                .rich-text-editor ul {
                    list-style-type: disc;
                    margin-top: 0;
                    margin-bottom: 1em;
                    padding-left: 2em;
                }
                .rich-text-editor ul ul {
                    list-style-type: circle;
                }
                .rich-text-editor ul ul ul {
                    list-style-type: square;
                }
                .rich-text-editor ol {
                    list-style-type: decimal;
                    margin-top: 0;
                    margin-bottom: 1em;
                    padding-left: 2em;
                }
                .rich-text-editor li {
                    margin-bottom: 0.25em;
                    line-height: 1.6;
                }
                .rich-text-editor li > p {
                    margin-bottom: 0.25em;
                }
                .rich-text-editor li:last-child {
                    margin-bottom: 0;
                }
                .rich-text-editor blockquote {
                    border-left: 4px solid hsl(var(--border));
                    margin: 1em 0;
                    padding-left: 1em;
                    font-style: italic;
                    color: hsl(var(--muted-foreground));
                }
                .rich-text-editor blockquote p {
                    margin-bottom: 0.5em;
                }
                .rich-text-editor blockquote p:last-child {
                    margin-bottom: 0;
                }
                .rich-text-editor a {
                    color: hsl(var(--primary));
                    text-decoration: underline;
                    text-underline-offset: 2px;
                    cursor: pointer;
                }
                .rich-text-editor a:hover {
                    opacity: 0.8;
                }
                .rich-text-editor img,
                .rich-text-editor .rich-text-image {
                    max-width: 100%;
                    height: auto;
                    display: inline-block;
                    margin: 0.5em 0;
                    border-radius: 4px;
                }
                .rich-text-editor img.ProseMirror-selectednode,
                .rich-text-editor .rich-text-image.ProseMirror-selectednode {
                    outline: 2px solid hsl(var(--primary));
                    outline-offset: 2px;
                }
                .rich-text-editor code {
                    background-color: hsl(var(--muted));
                    border-radius: 3px;
                    font-family: 'Courier New', Courier, monospace;
                    padding: 0.2em 0.4em;
                    font-size: 0.9em;
                }
                .rich-text-editor pre {
                    background-color: hsl(var(--muted));
                    border-radius: 6px;
                    padding: 1em;
                    overflow-x: auto;
                    margin: 1em 0;
                }
                .rich-text-editor pre code {
                    background-color: transparent;
                    padding: 0;
                    font-size: 0.9em;
                }
                .rich-text-editor hr {
                    border: none;
                    border-top: 1px solid hsl(var(--border));
                    margin: 2em 0;
                }
                .rich-text-editor:focus {
                    outline: none;
                }
                .rich-text-editor > *:first-child {
                    margin-top: 0;
                }
                .rich-text-editor > *:last-child {
                    margin-bottom: 0;
                }
            `}</style>
        </div>
    );
}
