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
        if (!this.formControlName) {
            return;
        }
        if (val === false) {
            this.formControlName.control.enable();
        } else {
            this.formControlName.control.disable();
        }
    }

    constructor(@Optional() private formControlName: FormControlName) {}
}
