import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Dialog } from '../../../../providers/modal/modal.types';

export interface LinkAttrs {
    href: string;
    title: string;
}

@Component({
    selector: 'vdr-link-dialog',
    templateUrl: './link-dialog.component.html',
    styleUrls: ['./link-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkDialogComponent implements OnInit, Dialog<LinkAttrs> {
    form: UntypedFormGroup;

    resolveWith: (result?: LinkAttrs) => void;
    existing?: LinkAttrs;

    ngOnInit(): void {
        this.form = new UntypedFormGroup({
            href: new UntypedFormControl(this.existing ? this.existing.href : '', Validators.required),
            title: new UntypedFormControl(this.existing ? this.existing.title : ''),
        });
    }

    remove() {
        this.resolveWith({
            title: '',
            href: '',
        });
    }

    select() {
        this.resolveWith(this.form.value);
    }
}
