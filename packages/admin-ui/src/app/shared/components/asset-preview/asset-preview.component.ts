import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Asset, UpdateAssetInput } from '../../../common/generated-types';
import { Dialog } from '../../providers/modal/modal.service';

@Component({
    selector: 'vdr-asset-preview',
    templateUrl: './asset-preview.component.html',
    styleUrls: ['./asset-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AssetPreviewComponent implements OnInit, OnDestroy {
    @Input() asset: Asset;
    @Output() assetChange = new EventEmitter<UpdateAssetInput>();

    form: FormGroup;

    size = 'medium';
    resolveWith: (result?: void) => void;
    width = 0;
    height = 0;
    centered = true;
    @ViewChild('imageElement', { static: true }) private imageElementRef: ElementRef<HTMLImageElement>;
    @ViewChild('previewDiv', { static: true }) private previewDivRef: ElementRef<HTMLDivElement>;
    private subscription: Subscription;

    constructor(private formBuilder: FormBuilder) {}

    ngOnInit() {
        const { focalPoint } = this.asset;
        this.form = this.formBuilder.group({
            name: [this.asset.name],
            focalPointX: [focalPoint ? focalPoint.x : null],
            focalPointY: [focalPoint ? focalPoint.y : null],
        });
        this.subscription = this.form.valueChanges.subscribe(value => {
            const focalPointValue =
                value.focalPointX != null && value.focalPointY != null
                    ? {
                          x: value.focalPointX,
                          y: value.focalPointY,
                      }
                    : null;
            this.assetChange.emit({
                id: this.asset.id,
                name: value.name,
                focalPoint: focalPointValue,
            });
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getSourceFileName(): string {
        const parts = this.asset.source.split('/');
        return parts[parts.length - 1];
    }

    getDimensions() {
        const img = this.imageElementRef.nativeElement;
        const container = this.previewDivRef.nativeElement;
        this.width = img.width;
        this.height = img.height;
        this.centered = img.width <= container.offsetWidth && img.height <= container.offsetHeight;
    }
}
