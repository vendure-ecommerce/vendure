import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataService, TagFragment } from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'vdr-tag-selector',
    templateUrl: './tag-selector.component.html',
    styleUrls: ['./tag-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TagSelectorComponent,
            multi: true,
        },
    ],
})
export class TagSelectorComponent implements OnInit, ControlValueAccessor {
    allTags$: Observable<string[]>;
    onChange: (val: any) => void;
    onTouch: () => void;
    _value: string[];
    disabled: boolean;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.allTags$ = this.dataService.product
            .getTagList()
            .mapStream(data => data.tags.items.map(i => i.value));
    }

    addTagFn(val: string) {
        return val;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: unknown): void {
        if (Array.isArray(obj)) {
            this._value = obj;
        }
    }

    valueChanged(event: string[]) {
        this.onChange(event);
    }
}
