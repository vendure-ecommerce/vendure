import { OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { CustomFieldConfig, LanguageCode, StringFieldOption } from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';

/**
 * Displays a localized label for a CustomField or StringFieldOption, falling back to the
 * name/value if none are defined.
 */
@Pipe({
    name: 'customFieldLabel',
    pure: false,
})
export class CustomFieldLabelPipe implements PipeTransform, OnDestroy {
    private readonly subscription: Subscription;
    private uiLanguageCode: LanguageCode;

    constructor(private dataService: DataService) {
        this.subscription = dataService.client.uiState().stream$.subscribe(val => {
            this.uiLanguageCode = val.uiState.language;
        });
    }

    transform(value: CustomFieldConfig | StringFieldOption): string {
        if (!value) {
            return value;
        }
        const { label } = value;
        const name = this.isCustomFieldConfig(value) ? value.name : value.value;
        if (label) {
            const match = label.find(l => l.languageCode === this.uiLanguageCode);
            return match ? match.value : label[0].value;
        } else {
            return name;
        }
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    private isCustomFieldConfig(input: any): input is CustomFieldConfig {
        return input.hasOwnProperty('name');
    }
}
