import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CurrentUserChannel } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-channel-assignment-control',
    templateUrl: './channel-assignment-control.component.html',
    styleUrls: ['./channel-assignment-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ChannelAssignmentControlComponent,
            multi: true,
        },
    ],
})
export class ChannelAssignmentControlComponent implements OnInit, ControlValueAccessor {
    @Input() multiple = true;
    @Input() includeDefaultChannel = true;

    channels$: Observable<CurrentUserChannel[]>;
    value: string[] = [];
    disabled = false;
    private onChange: (value: any) => void;
    private onTouched: () => void;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.channels$ = this.dataService.client
            .userStatus()
            .single$.pipe(
                map(({ userStatus }) =>
                    userStatus.channels.filter(c =>
                        this.includeDefaultChannel ? true : c.code !== DEFAULT_CHANNEL_CODE,
                    ),
                ),
            );
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(obj: unknown): void {
        if (Array.isArray(obj)) {
            this.value = obj;
        }
    }

    focussed() {
        if (this.onTouched) {
            this.onTouched();
        }
    }

    valueChanged(value: CurrentUserChannel[] | CurrentUserChannel | undefined) {
        if (Array.isArray(value)) {
            this.onChange(value.map(c => c.id));
        } else {
            this.onChange([value ? value.id : undefined]);
        }
    }
}
