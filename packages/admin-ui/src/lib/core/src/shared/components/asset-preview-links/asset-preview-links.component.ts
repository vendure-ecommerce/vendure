import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { AssetLike } from '../asset-gallery/asset-gallery.types';

@Component({
    selector: 'vdr-asset-preview-links',
    templateUrl: './asset-preview-links.component.html',
    styleUrls: ['./asset-preview-links.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssetPreviewLinksComponent {
    @Input() asset: AssetLike;
    sizes = ['tiny', 'thumb', 'small', 'medium', 'large', 'full'];
}
