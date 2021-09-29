import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { CustomFieldConfig, GetAsset, GetAssetList, UpdateAssetInput } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { ModalService } from '../../../providers/modal/modal.service';
import { NotificationService } from '../../../providers/notification/notification.service';
import { Point } from '../focal-point-control/focal-point-control.component';
import { ManageTagsDialogComponent } from '../manage-tags-dialog/manage-tags-dialog.component';

export type PreviewPreset = 'tiny' | 'thumb' | 'small' | 'medium' | 'large' | '';
type AssetLike = GetAssetList.Items | GetAsset.Asset;

@Component({
    selector: 'vdr-asset-preview',
    templateUrl: './asset-preview.component.html',
    styleUrls: ['./asset-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewComponent implements OnInit, OnDestroy {
    @Input() asset: AssetLike;
    @Input() editable = false;
    @Input() customFields: CustomFieldConfig[] = [];
    @Input() customFieldsForm: FormGroup | undefined;
    @Output() assetChange = new EventEmitter<Omit<UpdateAssetInput, 'focalPoint'>>();
    @Output() editClick = new EventEmitter();

    form: FormGroup;

    size: PreviewPreset = 'medium';
    width = 0;
    height = 0;
    centered = true;
    settingFocalPoint = false;
    lastFocalPoint?: Point;
    @ViewChild('imageElement', { static: true }) private imageElementRef: ElementRef<HTMLImageElement>;
    @ViewChild('previewDiv', { static: true }) private previewDivRef: ElementRef<HTMLDivElement>;
    private subscription: Subscription;
    private sizePriorToSettingFocalPoint: PreviewPreset;

    constructor(
        private formBuilder: FormBuilder,
        private dataService: DataService,
        private notificationService: NotificationService,
        private changeDetector: ChangeDetectorRef,
        private modalService: ModalService,
    ) {}

    get fpx(): number | null {
        return this.asset.focalPoint ? this.asset.focalPoint.x : null;
    }

    get fpy(): number | null {
        return this.asset.focalPoint ? this.asset.focalPoint.y : null;
    }

    ngOnInit() {
        const { focalPoint } = this.asset;
        this.form = this.formBuilder.group({
            name: [this.asset.name],
            tags: [this.asset.tags?.map(t => t.value)],
        });
        this.subscription = this.form.valueChanges.subscribe(value => {
            this.assetChange.emit({
                id: this.asset.id,
                name: value.name,
                tags: value.tags,
            });
        });

        this.subscription.add(
            fromEvent(window, 'resize')
                .pipe(debounceTime(50))
                .subscribe(() => {
                    this.updateDimensions();
                    this.changeDetector.markForCheck();
                }),
        );
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    customFieldIsSet(name: string): boolean {
        return !!this.customFieldsForm?.get([name]);
    }

    getSourceFileName(): string {
        const parts = this.asset.source.split('/');
        return parts[parts.length - 1];
    }

    onImageLoad() {
        this.updateDimensions();
        this.changeDetector.markForCheck();
    }

    updateDimensions() {
        const img = this.imageElementRef.nativeElement;
        const container = this.previewDivRef.nativeElement;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        const constrainToContainer = this.settingFocalPoint;
        if (constrainToContainer) {
            const controlsMarginPx = 48 * 2;
            const availableHeight = containerHeight - controlsMarginPx;
            const availableWidth = containerWidth;
            const hRatio = imgHeight / availableHeight;
            const wRatio = imgWidth / availableWidth;

            const imageExceedsAvailableDimensions = 1 < hRatio || 1 < wRatio;
            if (imageExceedsAvailableDimensions) {
                const factor = hRatio < wRatio ? wRatio : hRatio;
                this.width = Math.round(imgWidth / factor);
                this.height = Math.round(imgHeight / factor);
                this.centered = true;
                return;
            }
        }
        this.width = imgWidth;
        this.height = imgHeight;
        this.centered = imgWidth <= containerWidth && imgHeight <= containerHeight;
    }

    setFocalPointStart() {
        this.sizePriorToSettingFocalPoint = this.size;
        this.size = 'medium';
        this.settingFocalPoint = true;
        this.lastFocalPoint = this.asset.focalPoint || { x: 0.5, y: 0.5 };
        this.updateDimensions();
    }

    removeFocalPoint() {
        this.dataService.product
            .updateAsset({
                id: this.asset.id,
                focalPoint: null,
            })
            .subscribe(
                () => {
                    this.notificationService.success(_('asset.update-focal-point-success'));
                    this.asset = { ...this.asset, focalPoint: null };
                    this.changeDetector.markForCheck();
                },
                () => this.notificationService.error(_('asset.update-focal-point-error')),
            );
    }

    onFocalPointChange(point: Point) {
        this.lastFocalPoint = point;
    }

    setFocalPointCancel() {
        this.settingFocalPoint = false;
        this.lastFocalPoint = undefined;
        this.size = this.sizePriorToSettingFocalPoint;
    }

    setFocalPointEnd() {
        this.settingFocalPoint = false;
        this.size = this.sizePriorToSettingFocalPoint;
        if (this.lastFocalPoint) {
            const { x, y } = this.lastFocalPoint;
            this.lastFocalPoint = undefined;
            this.dataService.product
                .updateAsset({
                    id: this.asset.id,
                    focalPoint: { x, y },
                })
                .subscribe(
                    () => {
                        this.notificationService.success(_('asset.update-focal-point-success'));
                        this.asset = { ...this.asset, focalPoint: { x, y } };
                        this.changeDetector.markForCheck();
                    },
                    () => this.notificationService.error(_('asset.update-focal-point-error')),
                );
        }
    }

    manageTags() {
        this.modalService
            .fromComponent(ManageTagsDialogComponent, {
                size: 'sm',
            })
            .subscribe(result => {
                if (result) {
                    this.notificationService.success(_('common.notify-updated-tags-success'));
                }
            });
    }
}
