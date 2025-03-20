import { Button } from '@/components/ui/button.js';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog.js';
import { Textarea } from '@/components/ui/textarea.js';
import { Trans } from '@lingui/react/macro';
import { useState } from 'react';

interface NoteEditorProps {
    note: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onNoteChange: (noteId: string, note: string, isPrivate: boolean) => void;
    noteId: string;
    isPrivate: boolean;
}

export function NoteEditor({ open, onOpenChange, note, onNoteChange, noteId, isPrivate }: NoteEditorProps) {
    const [value, setValue] = useState(note);
    const handleSave = () => {
        onNoteChange(noteId, value, isPrivate);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        <Trans>Edit Note</Trans>
                    </DialogTitle>
                </DialogHeader>
                <Textarea value={value} onChange={e => setValue(e.target.value)} />
                <DialogFooter>
                    <Button onClick={() => handleSave()}>
                        <Trans>Save</Trans>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
