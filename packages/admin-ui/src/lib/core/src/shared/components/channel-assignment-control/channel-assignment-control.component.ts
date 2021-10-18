import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Channel, CurrentUserChannel } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-channel-assignment-control',
    templateUrl: './channel-assignment-control.component.html',
    styleUrls: ['./channel-assignment-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
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
    @Input() disableChannelIds: string[] = [];

    channels$: Observable<CurrentUserChannel[]>;
    value: CurrentUserChannel[] = [];
    disabled = false;
    private onChange: (value: any) => void;
    private onTouched: () => void;
    private channels: CurrentUserChannel[];

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.channels$ = this.dataService.client.userStatus().single$.pipe(
            map(({ userStatus }) =>
                userStatus.channels.filter(c =>
                    this.includeDefaultChannel ? true : c.code !== DEFAULT_CHANNEL_CODE,
                ),
            ),
            tap(channels => (this.channels = channels)),
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
            if (typeof obj[0] === 'string') {
                this.value = obj.map(id => this.channels?.find(c => c.id === id)).filter(notNullOrUndefined);
            } else {
                this.value = obj;
            }
        } else {
            if (typeof obj === 'string') {
                const channel = this.channels?.find(c => c.id === obj);
                if (channel) {
                    this.value = [channel];
                }
            } else if (obj && (obj as any).id) {
                this.value = [obj as any];
            }
        }
    }

    focussed() {
        if (this.onTouched) {
            this.onTouched();
        }
    }

    channelIsDisabled(id: string) {
        return this.disableChannelIds.includes(id);
    }

    valueChanged(value: CurrentUserChannel[] | CurrentUserChannel | undefined) {
        if (Array.isArray(value)) {
            this.onChange(value.map(c => c.id));
        } else {
            this.onChange([value ? value.id : undefined]);
        }
    }

    compareFn(c1: Channel | string, c2: Channel | string): boolean {
        const c1id = typeof c1 === 'string' ? c1 : c1.id;
        const c2id = typeof c2 === 'string' ? c2 : c2.id;
        return c1id === c2id;
    }
}
