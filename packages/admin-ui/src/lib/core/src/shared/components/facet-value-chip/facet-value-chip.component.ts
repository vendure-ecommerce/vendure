import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { FacetValue } from '../../../common/generated-types';

@Component({
    selector: 'vdr-facet-value-chip',
    templateUrl: './facet-value-chip.component.html',
    styleUrls: ['./facet-value-chip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetValueChipComponent {
    @Input() facetValue: FacetValue.Fragment;
    @Input() removable = true;
    @Input() displayFacetName = true;
    @Output() remove = new EventEmitter<void>();
}
