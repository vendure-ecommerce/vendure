import { Directive, ElementRef, Optional, Self } from '@angular/core';
import { FormControl, FormControlDirective, FormControlName, FormGroup, FormGroupDirective, NgForm } from '@angular/forms';

@Directive({selector: 'input, textarea, select'})
export class FormFieldControlDirective {
    formControl: FormControl;
    constructor(@Optional() private formControlName: FormControlName) {}

    get valid(): boolean {
        return !!this.formControlName.valid;
    }

    get touched(): boolean {
        return !!this.formControlName.touched;
    }
}
