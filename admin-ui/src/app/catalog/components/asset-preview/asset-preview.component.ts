import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';

import { Asset } from '../../../common/generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-asset-preview',
    templateUrl: './asset-preview.component.html',
    styleUrls: ['./asset-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class AssetPreviewComponent implements Dialog<void> {
    asset: Asset;
    size = 'medium';
    resolveWith: (result?: void) => void;
    width = 0;
    height = 0;
    centered = true;
    @ViewChild('imageElement') private imageElementRef: ElementRef<HTMLImageElement>;
    @ViewChild('previewDiv') private previewDivRef: ElementRef<HTMLDivElement>;

    getDimensions() {
        const img = this.imageElementRef.nativeElement;
        const container = this.previewDivRef.nativeElement;
        this.width = img.width;
        this.height = img.height;
        this.centered = img.width <= container.offsetWidth && img.height <= container.offsetHeight;
    }
}
