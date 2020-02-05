import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { Asset } from '../../../common/generated-types';
import { Dialog } from '../../providers/modal/modal.service';

@Component({
    selector: 'vdr-asset-preview-dialog',
    templateUrl: './asset-preview-dialog.component.html',
    styleUrls: ['./asset-preview-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewDialogComponent implements Dialog<void> {
    asset: Asset;
    resolveWith: (result?: void) => void;
}
