import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChild,
    Input,
    OnInit,
} from '@angular/core';

import { FormFieldControlDirective } from './form-field-control.directive';

/**
 * A form field wrapper which handles the correct layout and validation error display for
 * a form control.
 */
@Component({
    selector: 'vdr-form-field',
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss'],
})
export class FormFieldComponent implements OnInit {
    @Input() label: string;
    @Input() for: string;
    @Input() tooltip: string;
    /**
     * If set to true, the input will be initially set to "readOnly", and an "edit" button
     * will be displayed which allows the field to be edited.
     */
    @Input() readOnlyToggle = false;
    @ContentChild(FormFieldControlDirective) formFieldControl: FormFieldControlDirective;
    isReadOnly = false;

    ngOnInit() {
        if (this.readOnlyToggle) {
            this.isReadOnly = true;
            this.setReadOnly(true);
        }
        this.isReadOnly = this.readOnlyToggle;
    }

    setReadOnly(value: boolean) {
        this.formFieldControl.setReadOnly(value);
        this.isReadOnly = value;
    }
}
