import { Button } from '@/components/ui/button.js';
import { Textarea } from '@/components/ui/textarea.js';
import { useState } from 'react';
import { HistoryNoteCheckbox } from './history-note-checkbox.js';

interface HistoryNoteInputProps {
    onAddNote: (note: string, isPrivate: boolean) => void;
}

export function HistoryNoteInput({ onAddNote }: HistoryNoteInputProps) {
    const [note, setNote] = useState('');
    const [noteIsPrivate, setNoteIsPrivate] = useState(true);

    const handleAddNote = () => {
        if (note.trim()) {
            onAddNote(note, noteIsPrivate);
            setNote('');
        }
    };

    return (
        <div className="border rounded-md p-4">
            <div className="flex flex-col space-y-4">
                <Textarea
                    placeholder="Add a note..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="min-h-[80px] resize-none"
                />
                <div className="flex items-center justify-between">
                    <HistoryNoteCheckbox value={noteIsPrivate} onChange={setNoteIsPrivate} />
                    <Button onClick={handleAddNote} disabled={!note.trim()} size="sm">
                        Add note
                    </Button>
                </div>
            </div>
        </div>
    );
}
