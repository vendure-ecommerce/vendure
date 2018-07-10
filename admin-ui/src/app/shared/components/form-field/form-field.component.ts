import { AfterContentInit, ChangeDetectionStrategy, Component, ContentChild, Input } from '@angular/core';
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
export class FormFieldComponent {
    @Input() label: string;
    @Input() for: string;
    @Input() tooltip: string;
    @ContentChild(FormFieldControlDirective) formFieldControl: FormFieldControlDirective;
}
