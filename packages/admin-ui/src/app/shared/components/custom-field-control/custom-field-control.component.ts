import {
    AfterViewInit,
    Component,
    ComponentFactory,
    Input,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

import { CustomFieldsFragment, LanguageCode, LocalizedString } from '../../../common/generated-types';
import {
    CustomFieldComponentService,
    CustomFieldControl,
    CustomFieldEntityName,
} from '../../../core/providers/custom-field-component/custom-field-component.service';
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
export class CustomFieldControlComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() entityName: CustomFieldEntityName;
    @Input('customFieldsFormGroup') formGroup: FormGroup;
    @Input() customField: CustomFieldsFragment;
    @Input() compact = false;
    @Input() showLabel = true;
    @Input() readonly = false;
    hasCustomControl = false;
    @ViewChild('customComponentPlaceholder', { read: ViewContainerRef, static: false })
    private customComponentPlaceholder: ViewContainerRef;
    private customComponentFactory: ComponentFactory<CustomFieldControl> | undefined;
    private uiLanguageCode: LanguageCode;
    private sub: Subscription;

    constructor(
        private dataService: DataService,
        private customFieldComponentService: CustomFieldComponentService,
    ) {}

    ngOnInit(): void {
        this.sub = this.dataService.client
            .uiState()
            .mapStream(data => data.uiState.language)
            .subscribe(language => {
                this.uiLanguageCode = language;
            });
        this.customComponentFactory = this.customFieldComponentService.getCustomFieldComponent(
            this.entityName,
            this.customField.name,
        );
        this.hasCustomControl = !!this.customComponentFactory;
    }

    ngAfterViewInit(): void {
        if (this.customComponentFactory) {
            const customComponentRef = this.customComponentPlaceholder.createComponent(
                this.customComponentFactory,
            );
            customComponentRef.instance.customFieldConfig = this.customField;
            customComponentRef.instance.formControl = this.formGroup.get(
                this.customField.name,
            ) as FormControl;
        }
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
