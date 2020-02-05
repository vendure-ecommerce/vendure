import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Asset } from '../../../common/generated-types';
import { Dialog } from '../../providers/modal/modal.service';

@Component({
    selector: 'vdr-asset-preview',
    templateUrl: './asset-preview.component.html',
    styleUrls: ['./asset-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AssetPreviewComponent {
    @Input() asset: Asset;

    size = 'medium';
    resolveWith: (result?: void) => void;
    width = 0;
    height = 0;
    centered = true;
    @ViewChild('imageElement', { static: true }) private imageElementRef: ElementRef<HTMLImageElement>;
    @ViewChild('previewDiv', { static: true }) private previewDivRef: ElementRef<HTMLDivElement>;

    getDimensions() {
        const img = this.imageElementRef.nativeElement;
        const container = this.previewDivRef.nativeElement;
        this.width = img.width;
        this.height = img.height;
        this.centered = img.width <= container.offsetWidth && img.height <= container.offsetHeight;
    }
}
