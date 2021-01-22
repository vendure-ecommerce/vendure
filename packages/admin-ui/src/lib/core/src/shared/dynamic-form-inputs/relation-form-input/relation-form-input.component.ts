import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';

import { FormInputComponent } from '../../../common/component-registry-types';
import { RelationCustomFieldConfig } from '../../../common/generated-types';

@Component({
    selector: 'vdr-relation-form-input',
    templateUrl: './relation-form-input.component.html',
    styleUrls: ['./relation-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RelationFormInputComponent implements FormInputComponent {
    static readonly id: DefaultFormComponentId = 'relation-form-input';
    @Input() readonly: boolean;
    formControl: FormControl;
    config: RelationCustomFieldConfig;
}
