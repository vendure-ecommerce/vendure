import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Dialog } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-customer-group-detail-dialog',
    templateUrl: './customer-group-detail-dialog.component.html',
    styleUrls: ['./customer-group-detail-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerGroupDetailDialogComponent implements Dialog<string> {
    group: { id?: string; name: string };
    resolveWith: (result?: string) => void;

    cancel() {
        this.resolveWith();
    }

    save() {
        this.resolveWith(this.group.name);
    }
}
