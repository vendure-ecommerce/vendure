import { ScrollArea } from '@/vdb/components/ui/scroll-area.js';
import { createContext, useContext, useState } from 'react';
import { HistoryNoteEditor } from './history-note-editor.js';

interface HistoryTimelineProps {
    children: React.ReactNode;
    onEditNote?: (entryId: string, note: string, isPublic: boolean) => void;
    onDeleteNote?: (entryId: string) => void;
}

// Use context to make the note editing functions available to the child
// HistoryEntry component
const HistoryTimelineContext = createContext<{
    editNote: (noteId: string, note: string, isPrivate: boolean) => void;
    deleteNote: (noteId: string) => void;
}>({
    editNote: () => {},
    deleteNote: () => {},
});

type NoteEditorNote = { noteId: string; note: string; isPrivate: boolean };

export function useHistoryTimeline() {
    return useContext(HistoryTimelineContext);
}

export function HistoryTimeline({ children, onEditNote, onDeleteNote }: Readonly<HistoryTimelineProps>) {
    const [noteEditorOpen, setNoteEditorOpen] = useState(false);
    const [noteEditorNote, setNoteEditorNote] = useState<NoteEditorNote>({
        noteId: '',
        note: '',
        isPrivate: true,
    });

    const editNote = (noteId: string, note: string, isPrivate: boolean) => {
        setNoteEditorNote({ noteId, note, isPrivate });
        setNoteEditorOpen(true);
    };

    const deleteNote = (noteId: string) => {
        setNoteEditorNote({ noteId, note: '', isPrivate: true });
    };

    return (
        <HistoryTimelineContext.Provider value={{ editNote, deleteNote }}>
            <ScrollArea className="pr-2">
                <div className="relative">
                    <div className="absolute left-6 top-6 bottom-0 w-px bg-gradient-to-b from-border via-border/50 to-transparent" />
                    <div className="space-y-0.5">
                        {children}
                    </div>
                </div>
            </ScrollArea>
            <HistoryNoteEditor
                key={noteEditorNote.noteId}
                note={noteEditorNote.note}
                onNoteChange={(...args) => onEditNote?.(...args)}
                open={noteEditorOpen}
                onOpenChange={setNoteEditorOpen}
                noteId={noteEditorNote.noteId}
                isPrivate={noteEditorNote.isPrivate}
            />
        </HistoryTimelineContext.Provider>
    );
}
