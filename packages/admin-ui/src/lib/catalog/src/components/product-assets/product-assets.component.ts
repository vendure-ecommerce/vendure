import { CdkDrag, CdkDragMove, CdkDropList, CdkDropListGroup, moveItemInArray } from '@angular/cdk/drag-drop';
import { ViewportRuler } from '@angular/cdk/overlay';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import { Asset, AssetPickerDialogComponent, AssetPreviewDialogComponent, ModalService } from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';

export interface AssetChange {
    assetIds: string[];
    featuredAssetId: string | undefined;
}

/**
 * A component which displays the Assets associated with a product, and allows assets to be removed and
 * added, and for the featured asset to be set.
 *
 * Note: rather complex code for drag drop is due to a limitation of the default CDK implementation
 * which is addressed by a work-around from here: https://github.com/angular/components/issues/13372#issuecomment-483998378
 */
@Component({
    selector: 'vdr-product-assets',
    templateUrl: './product-assets.component.html',
    styleUrls: ['./product-assets.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAssetsComponent implements AfterViewInit {
    @Input() assets: Asset[] = [];
    @Input() featuredAsset: Asset | undefined;
    @HostBinding('class.compact')
    @Input()
    compact = false;
    @Output() change = new EventEmitter<AssetChange>();
    @ViewChild('dlg', { static: false, read: CdkDropListGroup }) listGroup: CdkDropListGroup<CdkDropList>;
    @ViewChild('dl', { static: false, read: CdkDropList }) placeholder: CdkDropList;

    public target: CdkDropList | null;
    public targetIndex: number;
    public source: CdkDropList | null;
    public sourceIndex: number;
    public dragIndex: number;
    public activeContainer;

    constructor(
        private modalService: ModalService,
        private changeDetector: ChangeDetectorRef,
        private viewportRuler: ViewportRuler,
    ) {}

    ngAfterViewInit() {
        const phElement = this.placeholder.element.nativeElement;

        phElement.style.display = 'none';
        if (phElement.parentElement) {
            phElement.parentElement.removeChild(phElement);
        }
    }

    selectAssets() {
        this.modalService
            .fromComponent(AssetPickerDialogComponent, {
                size: 'xl',
            })
            .subscribe(result => {
                if (result && result.length) {
                    this.assets = unique(this.assets.concat(result), 'id');
                    if (!this.featuredAsset) {
                        this.featuredAsset = result[0];
                    }
                    this.emitChangeEvent(this.assets, this.featuredAsset);
                    this.changeDetector.markForCheck();
                }
            });
    }

    setAsFeatured(asset: Asset) {
        this.featuredAsset = asset;
        this.emitChangeEvent(this.assets, asset);
    }

    isFeatured(asset: Asset): boolean {
        return !!this.featuredAsset && this.featuredAsset.id === asset.id;
    }

    previewAsset(asset: Asset) {
        this.modalService
            .fromComponent(AssetPreviewDialogComponent, {
                size: 'xl',
                closable: true,
                locals: { asset },
            })
            .subscribe();
    }

    removeAsset(asset: Asset) {
        this.assets = this.assets.filter(a => a.id !== asset.id);
        if (this.featuredAsset && this.featuredAsset.id === asset.id) {
            this.featuredAsset = this.assets.length > 0 ? this.assets[0] : undefined;
        }
        this.emitChangeEvent(this.assets, this.featuredAsset);
    }

    private emitChangeEvent(assets: Asset[], featuredAsset: Asset | undefined) {
        this.change.emit({
            assetIds: assets.map(a => a.id),
            featuredAssetId: featuredAsset && featuredAsset.id,
        });
    }

    dragMoved(e: CdkDragMove) {
        const point = this.getPointerPositionOnPage(e.event);

        this.listGroup._items.forEach(dropList => {
            if (__isInsideDropListClientRect(dropList, point.x, point.y)) {
                this.activeContainer = dropList;
                return;
            }
        });
    }

    dropListDropped() {
        if (!this.target || !this.source) {
            return;
        }

        const phElement = this.placeholder.element.nativeElement;
        // tslint:disable-next-line:no-non-null-assertion
        const parent = phElement.parentElement!;

        phElement.style.display = 'none';

        parent.removeChild(phElement);
        parent.appendChild(phElement);
        parent.insertBefore(this.source.element.nativeElement, parent.children[this.sourceIndex]);

        this.target = null;
        this.source = null;

        if (this.sourceIndex !== this.targetIndex) {
            moveItemInArray(this.assets, this.sourceIndex, this.targetIndex);
            this.emitChangeEvent(this.assets, this.featuredAsset);
        }
    }

    dropListEnterPredicate = (drag: CdkDrag, drop: CdkDropList) => {
        if (drop === this.placeholder) {
            return true;
        }
        if (drop !== this.activeContainer) {
            return false;
        }

        const phElement = this.placeholder.element.nativeElement;
        const sourceElement = drag.dropContainer.element.nativeElement;
        const dropElement = drop.element.nativeElement;
        const children = dropElement.parentElement && dropElement.parentElement.children;

        const dragIndex = __indexOf(children, this.source ? phElement : sourceElement);
        const dropIndex = __indexOf(children, dropElement);

        if (!this.source) {
            this.sourceIndex = dragIndex;
            this.source = drag.dropContainer;

            phElement.style.width = sourceElement.clientWidth + 'px';
            phElement.style.height = sourceElement.clientHeight + 'px';

            if (sourceElement.parentElement) {
                sourceElement.parentElement.removeChild(sourceElement);
            }
        }

        this.targetIndex = dropIndex;
        this.target = drop;

        phElement.style.display = '';
        if (dropElement.parentElement) {
            dropElement.parentElement.insertBefore(
                phElement,
                dropIndex > dragIndex ? dropElement.nextSibling : dropElement,
            );
        }

        this.placeholder.enter(
            drag,
            drag.element.nativeElement.offsetLeft,
            drag.element.nativeElement.offsetTop,
        );
        return false;
    }

    /** Determines the point of the page that was touched by the user. */
    getPointerPositionOnPage(event: MouseEvent | TouchEvent) {
        // `touches` will be empty for start/end events so we have to fall back to `changedTouches`.
        const point = __isTouchEvent(event) ? event.touches[0] || event.changedTouches[0] : event;
        const scrollPosition = this.viewportRuler.getViewportScrollPosition();

        return {
            x: point.pageX - scrollPosition.left,
            y: point.pageY - scrollPosition.top,
        };
    }
}

function __indexOf(collection: HTMLCollection | null, node: HTMLElement) {
    if (!collection) {
        return -1;
    }
    return Array.prototype.indexOf.call(collection, node);
}

/** Determines whether an event is a touch event. */
function __isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
    return event.type.startsWith('touch');
}

function __isInsideDropListClientRect(dropList: CdkDropList, x: number, y: number) {
    const { top, bottom, left, right } = dropList.element.nativeElement.getBoundingClientRect();
    return y >= top && y <= bottom && x >= left && x <= right;
}
