import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { CreateProductOptionGroup } from 'shared/generated-types';

import { Dialog } from '../../../shared/providers/modal/modal.service';
import { CreateOptionGroupFormComponent } from '../create-option-group-form/create-option-group-form.component';

@Component({
    selector: 'vdr-create-option-group-dialog',
    templateUrl: './create-option-group-dialog.component.html',
    styleUrls: ['./create-option-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOptionGroupDialogComponent implements Dialog<CreateProductOptionGroup> {
    productId: string;
    productName: string;
    @ViewChild('createOptionGroupForm') createOptionGroupForm: CreateOptionGroupFormComponent;
    resolveWith: (result?: CreateProductOptionGroup) => void;

    createOptionGroup() {
        this.createOptionGroupForm.createOptionGroup().subscribe(data => this.resolveWith(data));
    }

    cancel() {
        this.resolveWith();
    }
}
