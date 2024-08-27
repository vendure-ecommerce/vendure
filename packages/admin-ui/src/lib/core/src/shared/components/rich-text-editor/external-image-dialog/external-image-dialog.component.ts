import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
} from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

import { Asset, ASSET_SIZES, AssetPickerDialogComponent, ModalService } from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';
import { Dialog } from '../../../../providers/modal/modal.types';

export interface ExternalImageAttrs {
    src: string;
    title: string;
    alt: string;
    width: string;
    height: string;
}

export interface ExternalAssetChange {
    assets: Asset[];
}

@Component({
    selector: 'vdr-external-image-dialog',
    templateUrl: './external-image-dialog.component.html',
    styleUrls: ['./external-image-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalImageDialogComponent implements OnInit, Dialog<ExternalImageAttrs> {
    form: UntypedFormGroup;
    public assets: Asset[] = [];
    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() change = new EventEmitter<ExternalAssetChange>();

    resolveWith: (result?: ExternalImageAttrs) => void;
    previewLoaded = false;
    existing?: ExternalImageAttrs;
    sizes = ASSET_SIZES;
    preset = '';

    constructor(
        private modalService: ModalService,
        private changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        const initialSrc = this.existing?.src ? this.existing.src : '';

        if (initialSrc) {
            const url = new URL(initialSrc);
            this.preset = url.searchParams.get('preset') || '';
        }

        this.form = new UntypedFormGroup({
            src: new UntypedFormControl(this.existing ? this.existing.src : '', Validators.required),
            title: new UntypedFormControl(this.existing ? this.existing.title : ''),
            alt: new UntypedFormControl(this.existing ? this.existing.alt : ''),
            width: new UntypedFormControl(this.existing ? this.existing.width : ''),
            height: new UntypedFormControl(this.existing ? this.existing.height : ''),
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

    selectAssets() {
        this.modalService
            .fromComponent(AssetPickerDialogComponent, {
                size: 'xl',
                locals: {
                    multiSelect: false,
                },
            })
            .subscribe(result => {
                if (result && result.length) {
                    this.assets = unique(this.assets.concat(result), 'id');

                    this.form.patchValue({
                        src: result[0].source,
                    });

                    this.emitChangeEvent(this.assets);
                    this.changeDetector.markForCheck();
                }
            });
    }

    private emitChangeEvent(assets: Asset[]) {
        this.change.emit({
            assets,
        });
    }

    onSizeSelect(size: string) {
        const url = this.form.get('src')?.value.split('?')[0];
        const src = `${url}?preset=${size}`;

        this.form.patchValue({
            src,
            width: this.form.get('width')?.value,
            height: this.form.get('height')?.value,
        });
    }
}
