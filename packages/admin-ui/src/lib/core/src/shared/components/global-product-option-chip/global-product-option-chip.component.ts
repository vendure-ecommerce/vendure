import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Option } from '../global-product-option-selector/global-product-option-selector.component';

@Component({
    selector: 'vdr-global-product-option-chip',
    templateUrl: './global-product-option-chip.component.html',
    styleUrls: ['./global-product-option-chip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalProductOptionChipComponent implements OnInit {
    @Input() option: Option;
    @Input() groupName: string;
    @Input() isOption?: boolean;
    @Output() remove = new EventEmitter<void>();

    icon?: string;

    ngOnInit() {
        if (this.isOption) this.icon = undefined;
        else this.icon = this.option.locked ? 'lock' : 'times';
    }

    onRemove() {
        if (!this.option.locked && !this.isOption) this.remove.emit();
    }
}
