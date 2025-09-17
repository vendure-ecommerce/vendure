import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';
import { Trans } from '@/vdb/lib/trans.js';
import TextStyle from '@tiptap/extension-text-style';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
    BoldIcon,
    ItalicIcon,
    ListIcon,
    ListOrderedIcon,
    QuoteIcon,
    Redo2Icon,
    StrikethroughIcon,
    Undo2Icon,
} from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { Button } from '../ui/button.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.js';
import { Separator } from '../ui/separator.js';

// define your extension array
const extensions = [
    TextStyle.configure(),
    StarterKit.configure({
        bulletList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
        },
    }),
];

/**
 * @description
 * A component for displaying a rich text editor. Internally uses ProseMirror (rich text editor) under the hood.
 *
 * @docsCategory form-components
 * @docsPage RichTextInput
 */
export function RichTextInput({ value, onChange, fieldDef }: Readonly<DashboardFormComponentProps>) {
    const readOnly = isReadonlyField(fieldDef);
    const isInternalUpdate = useRef(false);

    const editor = useEditor({
        parseOptions: {
            preserveWhitespace: 'full',
        },
        extensions: extensions,
        content: value,
        editable: !readOnly,
        onUpdate: ({ editor }) => {
            if (!readOnly) {
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
                class: `rich-text-editor placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content min-h-16 w-full bg-transparent px-3 py-2 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-h-[500px] overflow-y-auto ${readOnly ? 'cursor-not-allowed opacity-50' : ''}`,
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

    // Update editor's editable state when disabled prop changes
    useLayoutEffect(() => {
        if (editor) {
            editor.setEditable(!readOnly, false);
        }
    }, [readOnly, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border rounded-md overflow-hidden">
            <EditorToolbar editor={editor} disabled={readOnly} />
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

function EditorToolbar({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) {
    if (!editor) return null;

    const handleHeadingChange = (value: string) => {
        if (value === 'paragraph') {
            editor.chain().focus().setParagraph().run();
        } else {
            const level = parseInt(value.replace('h', '')) as 1 | 2 | 3 | 4 | 5 | 6;
            editor.chain().focus().toggleHeading({ level }).run();
        }
    };

    const getCurrentHeading = () => {
        for (let level = 1; level <= 6; level++) {
            if (editor.isActive('heading', { level })) return `h${level}`;
        }
        return 'paragraph';
    };

    const headingOptions = [
        { value: 'paragraph', label: <Trans>Normal</Trans> },
        { value: 'h1', label: <Trans>Heading 1</Trans> },
        { value: 'h2', label: <Trans>Heading 2</Trans> },
        { value: 'h3', label: <Trans>Heading 3</Trans> },
        { value: 'h4', label: <Trans>Heading 4</Trans> },
        { value: 'h5', label: <Trans>Heading 5</Trans> },
        { value: 'h6', label: <Trans>Heading 6</Trans> },
    ];

    return (
        <div className="flex items-center gap-1 p-2 border-b bg-muted/30">
            <Select value={getCurrentHeading()} onValueChange={handleHeadingChange} disabled={disabled}>
                <SelectTrigger className="h-8 w-[130px]">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {headingOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                            <span className="text-xs">{option.label}</span>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`h-8 px-2 ${editor.isActive('bold') ? 'bg-accent' : ''}`}
                    disabled={disabled}
                >
                    <BoldIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`h-8 px-2 ${editor.isActive('italic') ? 'bg-accent' : ''}`}
                    disabled={disabled}
                >
                    <ItalicIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={`h-8 px-2 ${editor.isActive('strike') ? 'bg-accent' : ''}`}
                    disabled={disabled}
                >
                    <StrikethroughIcon className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={`h-8 px-2 ${editor.isActive('bulletList') ? 'bg-accent' : ''}`}
                    disabled={disabled}
                >
                    <ListIcon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={`h-8 px-2 ${editor.isActive('orderedList') ? 'bg-accent' : ''}`}
                    disabled={disabled}
                >
                    <ListOrderedIcon className="h-4 w-4" />
                </Button>
            </div>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`h-8 px-2 ${editor.isActive('blockquote') ? 'bg-accent' : ''}`}
                disabled={disabled}
            >
                <QuoteIcon className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="mx-1 h-6" />

            <div className="flex items-center gap-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={disabled || !editor.can().undo()}
                    className="h-8 px-2"
                >
                    <Undo2Icon className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={disabled || !editor.can().redo()}
                    className="h-8 px-2"
                >
                    <Redo2Icon className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
