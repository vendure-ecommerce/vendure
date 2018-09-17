import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Asset } from 'shared/generated-types';

@Component({
    selector: 'vdr-asset-gallery',
    templateUrl: './asset-gallery.component.html',
    styleUrls: ['./asset-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetGalleryComponent {
    @Input() assets: Asset[];
    /**
     * If true, allows multiple assets to be selected by ctrl+clicking.
     */
    @Input() multiSelect = false;

    selection: Asset[] = [];

    toggleSelection(event: MouseEvent, asset: Asset) {
        const index = this.selection.findIndex(a => a.id === asset.id);
        if (index === -1) {
            if (this.multiSelect && event.ctrlKey) {
                this.selection.push(asset);
            } else {
                this.selection = [asset];
            }
        } else {
            if (this.multiSelect && event.ctrlKey) {
                this.selection.splice(index, 1);
            } else if (1 < this.selection.length) {
                this.selection = [asset];
            } else {
                this.selection.splice(index, 1);
            }
        }
    }

    isSelected(asset: Asset): boolean {
        return !!this.selection.find(a => a.id === asset.id);
    }

    lastSelected(): Asset {
        return this.selection[this.selection.length - 1];
    }
}
