import { Pipe, PipeTransform } from '@angular/core';

import { CustomFieldConfig, LanguageCode, StringFieldOption } from '../../common/generated-types';

/**
 * Displays a localized label for a CustomField or StringFieldOption, falling back to the
 * name/value if none are defined.
 */
@Pipe({
    name: 'customFieldLabel',
    pure: true,
})
export class CustomFieldLabelPipe implements PipeTransform {
    transform(value: CustomFieldConfig | StringFieldOption, uiLanguageCode: LanguageCode | null): string {
        if (!value) {
            return value;
        }
        const { label } = value;
        const name = this.isCustomFieldConfig(value) ? value.name : value.value;
        if (label) {
            const match = label.find(l => l.languageCode === uiLanguageCode);
            return match ? match.value : label[0].value;
        } else {
            return name;
        }
    }

    private isCustomFieldConfig(input: any): input is CustomFieldConfig {
        return input.hasOwnProperty('name');
    }
}
