import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { _ } from '@vendure/admin-ui/src/app/core/providers/i18n/mark-for-extraction';

import { Asset, UpdateAssetInput } from '../../../common/generated-types';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { Dialog } from '../../providers/modal/modal.service';

@Component({
    selector: 'vdr-asset-preview-dialog',
    templateUrl: './asset-preview-dialog.component.html',
    styleUrls: ['./asset-preview-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewDialogComponent implements Dialog<void> {
    asset: Asset;
    assetChanges?: UpdateAssetInput;
    resolveWith: (result?: void) => void;

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    updateAsset() {
        if (this.assetChanges) {
            this.dataService.product.updateAsset(this.assetChanges).subscribe(
                () => {
                    this.assetChanges = undefined;
                    this.notificationService.success(_('common.notify-update-success'), { entity: 'Asset' });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Asset',
                    });
                },
            );
        }
    }
}
