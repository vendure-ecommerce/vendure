import { useCopyToClipboard } from '@uidotdev/usehooks';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { useState } from 'react';

export function CopyableText({ text }: Readonly<{ text: string }>) {
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [, copy] = useCopyToClipboard();

    const handleCopy = async (text: string, id: string) => {
        await copy(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <div className="font-mono">{text}</div>
            <button
                onClick={() => handleCopy(text, 'page')}
                className="p-1 hover:bg-muted rounded-md transition-colors"
            >
                {copiedId === 'page' ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <CopyIcon className="h-4 w-4" />
                )}
            </button>
        </div>
    );
}
