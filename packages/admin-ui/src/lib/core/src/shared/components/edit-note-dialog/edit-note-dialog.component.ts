import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Dialog } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-edit-note-dialog',
    templateUrl: './edit-note-dialog.component.html',
    styleUrls: ['./edit-note-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditNoteDialogComponent implements Dialog<{ note: string; isPrivate?: boolean }> {
    displayPrivacyControls = true;
    noteIsPrivate = true;
    note = '';
    resolveWith: (result?: { note: string; isPrivate?: boolean }) => void;

    confirm() {
        this.resolveWith({
            note: this.note,
            isPrivate: this.noteIsPrivate,
        });
    }

    cancel() {
        this.resolveWith();
    }
}
