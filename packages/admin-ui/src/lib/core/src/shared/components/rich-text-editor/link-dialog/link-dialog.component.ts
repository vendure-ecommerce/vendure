import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Dialog } from '../../../../providers/modal/modal.service';

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
    form: FormGroup;

    resolveWith: (result?: LinkAttrs) => void;
    existing?: LinkAttrs;

    ngOnInit(): void {
        this.form = new FormGroup({
            href: new FormControl(this.existing ? this.existing.href : '', Validators.required),
            title: new FormControl(this.existing ? this.existing.title : ''),
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
