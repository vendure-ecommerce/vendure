import TextStyle from '@tiptap/extension-text-style';
import { BubbleMenu, Editor, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { BoldIcon, ItalicIcon, StrikethroughIcon } from 'lucide-react';
import { useLayoutEffect, useRef } from 'react';
import { Button } from '../ui/button.js';

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

export interface RichTextInputProps {
    value: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}

export function RichTextInput({ value, onChange, disabled }: Readonly<RichTextInputProps>) {
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
                onChange(editor.getHTML());
            }
        },
        editorProps: {
            attributes: {
                class: `border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/10 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm max-h-[500px] overflow-y-auto ${disabled ? 'cursor-not-allowed opacity-50' : ''}`,
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
            editor.setEditable(!disabled);
        }
    }, [disabled, editor]);

    if (!editor) {
        return null;
    }

    return (
        <>
            <EditorContent editor={editor} />
            <CustomBubbleMenu editor={editor} disabled={disabled} />
        </>
    );
}

function CustomBubbleMenu({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) {
    if (!editor || disabled) return null;
    return (
        <BubbleMenu editor={editor}>
            <div className="flex items-center gap-2 bg-background p-2 rounded-md border">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-accent' : ''}
                    disabled={disabled}
                >
                    <BoldIcon className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-accent' : ''}
                    disabled={disabled}
                >
                    <ItalicIcon className="w-4 h-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={editor.isActive('strike') ? 'bg-accent' : ''}
                    disabled={disabled}
                >
                    <StrikethroughIcon className="w-4 h-4" />
                </Button>
            </div>
        </BubbleMenu>
    );
}
