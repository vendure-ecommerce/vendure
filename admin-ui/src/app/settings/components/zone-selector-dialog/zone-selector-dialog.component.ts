import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Zone } from 'shared/generated-types';

import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-zone-selector-dialog',
    templateUrl: './zone-selector-dialog.component.html',
    styleUrls: ['./zone-selector-dialog.component.scss'],
})
export class ZoneSelectorDialogComponent implements Dialog<Zone.Fragment | { name: string }> {
    allZones: Zone.Fragment[];
    canCreateNewZone = false;
    resolveWith: (result?: Zone.Fragment | { name: string }) => void;
    selected: any;

    onChange(e) {
        this.selected = e;
    }

    select() {
        this.resolveWith(this.selected);
    }

    cancel() {
        this.resolveWith();
    }
}
