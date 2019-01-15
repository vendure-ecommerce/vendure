import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    AbstractControl,
    ControlValueAccessor,
    FormControl,
    FormGroup,
    NG_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors,
    Validator,
    Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdjustmentOperation, FacetWithValues } from 'shared/generated-types';

import { interpolateDescription } from '../../../common/utilities/interpolate-description';

/**
 * A form input which renders a card with the internal form fields of the given AdjustmentOperation.
 */
@Component({
    selector: 'vdr-adjustment-operation-input',
    templateUrl: './adjustment-operation-input.component.html',
    styleUrls: ['./adjustment-operation-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: AdjustmentOperationInputComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => AdjustmentOperationInputComponent),
            multi: true,
        },
    ],
})
export class AdjustmentOperationInputComponent
    implements OnChanges, OnDestroy, ControlValueAccessor, Validator {
    @Input() operation: AdjustmentOperation;
    @Input() facets: FacetWithValues.Fragment[] = [];
    @Output() remove = new EventEmitter<AdjustmentOperation>();
    argValues: { [name: string]: any } = {};
    onChange: (val: any) => void;
    onTouch: () => void;
    form = new FormGroup({});
    private subscription: Subscription;

    interpolateDescription(): string {
        return interpolateDescription(this.operation, this.form.value);
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('operation' in changes) {
            this.createForm();
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }

    setDisabledState(isDisabled: boolean) {
        if (isDisabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }
    }

    writeValue(value: any): void {
        if (value) {
            this.form.patchValue(value);
        }
    }

    private createForm() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.form = new FormGroup({});
        if (this.operation.args) {
            for (const arg of this.operation.args) {
                this.form.addControl(arg.name, new FormControl(arg.value, Validators.required));
            }
        }

        this.subscription = this.form.valueChanges.subscribe(value => {
            if (this.onChange) {
                this.onChange({
                    code: this.operation.code,
                    args: value,
                });
            }
            if (this.onTouch) {
                this.onTouch();
            }
        });
    }

    validate(c: AbstractControl): ValidationErrors | null {
        if (this.form.invalid) {
            return {
                required: true,
            };
        }
        return null;
    }
}
