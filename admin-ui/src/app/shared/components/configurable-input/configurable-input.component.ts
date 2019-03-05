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
import { ConfigurableOperation, FacetWithValues } from 'shared/generated-types';

import { interpolateDescription } from '../../../common/utilities/interpolate-description';

/**
 * A form input which renders a card with the internal form fields of the given ConfigurableOperation.
 */
@Component({
    selector: 'vdr-configurable-input',
    templateUrl: './configurable-input.component.html',
    styleUrls: ['./configurable-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: ConfigurableInputComponent,
            multi: true,
        },
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => ConfigurableInputComponent),
            multi: true,
        },
    ],
})
export class ConfigurableInputComponent implements OnChanges, OnDestroy, ControlValueAccessor, Validator {
    @Input() operation: ConfigurableOperation;
    @Input() facets: FacetWithValues.Fragment[] = [];
    @Output() remove = new EventEmitter<ConfigurableOperation>();
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
