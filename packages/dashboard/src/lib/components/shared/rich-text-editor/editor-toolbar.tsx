import { Trans } from '@/vdb/lib/trans.js';
import { Editor } from '@tiptap/react';
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
import { Button } from '../../ui/button.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select.js';
import { Separator } from '../../ui/separator.js';

export interface EditorToolbarProps {
    editor: Editor | null;
    disabled?: boolean;
}

export function EditorToolbar({ editor, disabled }: EditorToolbarProps) {
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