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

export function HistoryTimeline({ children, onEditNote, onDeleteNote }: HistoryTimelineProps) {
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
            <ScrollArea className=" pr-4">
                <div className="relative">
                    <div className="absolute left-5 top-0 bottom-[44px] w-0.5 bg-gray-200" />
                    {children}
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
