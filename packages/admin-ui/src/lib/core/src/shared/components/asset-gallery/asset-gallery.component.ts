import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import { Asset, GetAssetList } from '../../../common/generated-types';
import { ModalService } from '../../../providers/modal/modal.service';
import { AssetPreviewDialogComponent } from '../asset-preview-dialog/asset-preview-dialog.component';

export type AssetLike = GetAssetList.Items;

@Component({
    selector: 'vdr-asset-gallery',
    templateUrl: './asset-gallery.component.html',
    styleUrls: ['./asset-gallery.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetGalleryComponent implements OnChanges {
    @Input() assets: AssetLike[];
    /**
     * If true, allows multiple assets to be selected by ctrl+clicking.
     */
    @Input() multiSelect = false;
    @Input() canDelete = false;
    @Output() selectionChange = new EventEmitter<AssetLike[]>();
    @Output() deleteAssets = new EventEmitter<AssetLike[]>();

    selection: AssetLike[] = [];

    constructor(private modalService: ModalService) {}

    ngOnChanges() {
        if (this.assets) {
            for (const asset of this.selection) {
                // Update and selected assets with any changes
                const match = this.assets.find(a => a.id === asset.id);
                if (match) {
                    Object.assign(asset, match);
                }
            }
        }
    }

    toggleSelection(asset: AssetLike, event?: MouseEvent) {
        const index = this.selection.findIndex(a => a.id === asset.id);
        if (this.multiSelect && event?.shiftKey && 1 <= this.selection.length) {
            const lastSelection = this.selection[this.selection.length - 1];
            const lastSelectionIndex = this.assets.findIndex(a => a.id === lastSelection.id);
            const currentIndex = this.assets.findIndex(a => a.id === asset.id);
            const start = currentIndex < lastSelectionIndex ? currentIndex : lastSelectionIndex;
            const end = currentIndex > lastSelectionIndex ? currentIndex + 1 : lastSelectionIndex;
            this.selection.push(
                ...this.assets.slice(start, end).filter(a => !this.selection.find(s => s.id === a.id)),
            );
        } else if (index === -1) {
            if (this.multiSelect && (event?.ctrlKey || event?.shiftKey)) {
                this.selection.push(asset);
            } else {
                this.selection = [asset];
            }
        } else {
            if (this.multiSelect && event?.ctrlKey) {
                this.selection.splice(index, 1);
            } else if (1 < this.selection.length) {
                this.selection = [asset];
            } else {
                this.selection.splice(index, 1);
            }
        }
        // Make the selection mutable
        this.selection = this.selection.map(x => ({ ...x }));
        this.selectionChange.emit(this.selection);
    }

    selectMultiple(assets: AssetLike[]) {
        this.selection = assets;
        this.selectionChange.emit(this.selection);
    }

    isSelected(asset: AssetLike): boolean {
        return !!this.selection.find(a => a.id === asset.id);
    }

    lastSelected(): AssetLike {
        return this.selection[this.selection.length - 1];
    }

    previewAsset(asset: AssetLike) {
        this.modalService
            .fromComponent(AssetPreviewDialogComponent, {
                size: 'xl',
                closable: true,
                locals: { asset },
            })
            .subscribe();
    }

    entityInfoClick(event: MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
    }
}
