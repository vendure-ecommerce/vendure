import { Directive, ElementRef, Optional, Self } from '@angular/core';
import {
    FormControl,
    FormControlDirective,
    FormControlName,
    FormGroup,
    FormGroupDirective,
    NgControl,
    NgForm,
} from '@angular/forms';

// tslint:disable:directive-selector
@Directive({ selector: 'input, textarea, select' })
export class FormFieldControlDirective {
    formControl: FormControl;
    constructor(@Optional() private formControlName: NgControl) {}

    get valid(): boolean {
        return !!this.formControlName && !!this.formControlName.valid;
    }

    get touched(): boolean {
        return !!this.formControlName && !!this.formControlName.touched;
    }
}
