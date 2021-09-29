import { ChangeDetectionStrategy, Component, TemplateRef } from '@angular/core';

import { Dialog } from '../../../../providers/modal/modal.service';

@Component({
    selector: 'vdr-relation-selector-dialog',
    templateUrl: './relation-selector-dialog.component.html',
    styleUrls: ['./relation-selector-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationSelectorDialogComponent implements Dialog<string[]> {
    resolveWith: (result?: string[]) => void;
    title: string;
    selectorTemplate: TemplateRef<any>;
}
