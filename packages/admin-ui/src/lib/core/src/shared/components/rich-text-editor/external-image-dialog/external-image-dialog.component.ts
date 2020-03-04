import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Dialog } from '../../../../providers/modal/modal.service';

export interface ExternalImageAttrs {
    src: string;
    title: string;
    alt: string;
}

@Component({
    selector: 'vdr-external-image-dialog',
    templateUrl: './external-image-dialog.component.html',
    styleUrls: ['./external-image-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalImageDialogComponent implements OnInit, Dialog<ExternalImageAttrs> {
    form: FormGroup;

    resolveWith: (result?: ExternalImageAttrs) => void;
    previewLoaded = false;
    existing?: ExternalImageAttrs;

    ngOnInit(): void {
        this.form = new FormGroup({
            src: new FormControl(this.existing ? this.existing.src : '', Validators.required),
            title: new FormControl(this.existing ? this.existing.title : ''),
            alt: new FormControl(this.existing ? this.existing.alt : ''),
        });
    }

    select() {
        this.resolveWith(this.form.value);
    }

    onImageLoad(event: Event) {
        this.previewLoaded = true;
    }

    onImageError(event: Event) {
        this.previewLoaded = false;
    }
}
