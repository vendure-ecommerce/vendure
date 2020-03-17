import { Directive, Input, Optional } from '@angular/core';
import { FormControl, FormControlName } from '@angular/forms';

/**
 * Allows declarative binding to the "disabled" property of a reactive form
 * control.
 */
@Directive({
    selector: '[vdrDisabled]',
})
export class DisabledDirective {
    @Input('vdrDisabled') set disabled(val: boolean) {
        if (!this.formControlName || !this.formControlName.control) {
            return;
        }
        if (val === false) {
            this.formControlName.control.enable({ emitEvent: false });
        } else {
            this.formControlName.control.disable({ emitEvent: false });
        }
    }

    constructor(@Optional() private formControlName: FormControlName) {}
}
