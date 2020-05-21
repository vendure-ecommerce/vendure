import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Dialog } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-zone-detail-dialog',
    templateUrl: './zone-detail-dialog.component.html',
    styleUrls: ['./zone-detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZoneDetailDialogComponent implements Dialog<string> {
    zone: { id?: string; name: string };
    resolveWith: (result?: string) => void;

    cancel() {
        this.resolveWith();
    }

    save() {
        this.resolveWith(this.zone.name);
    }
}
