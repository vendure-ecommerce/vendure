import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';
import { uniqBy } from 'lodash';

export type Option = {
    id?: string;
    name: string;
    code?: string;
    locked: boolean;
};

@Component({
    selector: 'vdr-global-product-option-selector',
    templateUrl: './global-product-option-selector.component.html',
    styleUrls: ['./global-product-option-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: GlobalProductOptionSelectorComponent,
            multi: true,
        },
    ],
})
export class GlobalProductOptionSelectorComponent implements OnChanges, OnInit {
    @Output() add = new EventEmitter<Option>();
    @Output() remove = new EventEmitter<Option>();
    @Input() groupName: string;
    @Input() options: Option[];
    @Input() value: Option[];

    selectedIds: string[];
    mergedOptions: Option[];

    @ViewChild(NgSelectComponent) private ngSelect: NgSelectComponent;

    ngOnInit() {
        this.initMergedOptions();
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('options' in changes) {
            this.options = changes.options.currentValue;
            this.initMergedOptions();
        }
        if ('value' in changes) {
            this.value = changes.value.currentValue;
            this.selectedIds = this.value.map(v => v.name);
            this.initMergedOptions();
        }
    }

    initMergedOptions() {
        this.mergedOptions = uniqBy([this.options, this.value].flat(), 'name');
    }

    focus() {
        this.ngSelect.focus();
    }
}
