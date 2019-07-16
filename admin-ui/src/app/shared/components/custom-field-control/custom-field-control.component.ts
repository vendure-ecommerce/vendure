import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import {
    CustomFieldConfig,
    CustomFieldsFragment,
    GetServerConfig,
    LanguageCode,
    LocalizedString,
} from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

/**
 * This component renders the appropriate type of form input control based
 * on the "type" property of the provided CustomFieldConfig.
 */
@Component({
    selector: 'vdr-custom-field-control',
    templateUrl: './custom-field-control.component.html',
    styleUrls: ['./custom-field-control.component.scss'],
})
export class CustomFieldControlComponent implements OnInit, OnDestroy {
    @Input('customFieldsFormGroup') formGroup: FormGroup;
    @Input() customField: CustomFieldsFragment;
    @Input() showLabel = true;
    private uiLanguageCode: LanguageCode;
    private sub: Subscription;

    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.sub = this.dataService.client
            .uiState()
            .mapStream(data => data.uiState.language)
            .subscribe(language => {
                this.uiLanguageCode = language;
            });
    }

    ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    get isTextInput(): boolean {
        if (this.customField.__typename === 'StringCustomFieldConfig') {
            return !this.customField.options;
        } else {
            return this.customField.__typename === 'LocaleStringCustomFieldConfig';
        }
    }

    get isSelectInput(): boolean {
        if (this.customField.__typename === 'StringCustomFieldConfig') {
            return !!this.customField.options;
        }
        return false;
    }

    get stringOptions() {
        if (this.customField.__typename === 'StringCustomFieldConfig') {
            return this.customField.options || [];
        }
        return [];
    }

    get label(): string | undefined {
        if (this.showLabel) {
            return this.getLabel(this.customField.name, this.customField.label);
        }
    }

    get min(): string | number | undefined | null {
        switch (this.customField.__typename) {
            case 'IntCustomFieldConfig':
                return this.customField.intMin;
            case 'FloatCustomFieldConfig':
                return this.customField.floatMin;
            case 'DateTimeCustomFieldConfig':
                return this.customField.datetimeMin;
        }
    }

    get max(): string | number | undefined | null {
        switch (this.customField.__typename) {
            case 'IntCustomFieldConfig':
                return this.customField.intMax;
            case 'FloatCustomFieldConfig':
                return this.customField.floatMax;
            case 'DateTimeCustomFieldConfig':
                return this.customField.datetimeMax;
        }
    }

    get step(): string | number | undefined | null {
        switch (this.customField.__typename) {
            case 'IntCustomFieldConfig':
                return this.customField.intStep;
            case 'FloatCustomFieldConfig':
                return this.customField.floatStep;
            case 'DateTimeCustomFieldConfig':
                return this.customField.datetimeStep;
        }
    }

    updateDateTime(formControl: FormControl, event: Event) {
        const value = (event.target as HTMLInputElement).value;
        formControl.setValue(value ? new Date(value).toISOString() : null, { emitEvent: true });
        formControl.parent.markAsDirty();
    }

    getLabel(defaultLabel: string, label?: LocalizedString[] | null): string {
        if (label) {
            const match = label.find(l => l.languageCode === this.uiLanguageCode);
            return match ? match.value : label[0].value;
        } else {
            return defaultLabel;
        }
    }
}
