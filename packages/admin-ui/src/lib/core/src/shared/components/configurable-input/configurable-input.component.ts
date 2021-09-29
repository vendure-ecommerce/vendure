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
import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { Subscription } from 'rxjs';

import { InputComponentConfig } from '../../../common/component-registry-types';
import {
    ConfigArg,
    ConfigArgDefinition,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
} from '../../../common/generated-types';
import { getDefaultConfigArgValue } from '../../../common/utilities/configurable-operation-utils';
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
    @Input() operation?: ConfigurableOperation;
    @Input() operationDefinition?: ConfigurableOperationDefinition;
    @Input() readonly = false;
    @Input() removable = true;
    @Output() remove = new EventEmitter<ConfigurableOperation>();
    argValues: { [name: string]: any } = {};
    onChange: (val: any) => void;
    onTouch: () => void;
    form = new FormGroup({});
    private subscription: Subscription;

    interpolateDescription(): string {
        if (this.operationDefinition) {
            return interpolateDescription(this.operationDefinition, this.form.value);
        } else {
            return '';
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        if ('operation' in changes || 'operationDefinition' in changes) {
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

    trackByName(index: number, arg: ConfigArg): string {
        return arg.name;
    }

    getArgDef(arg: ConfigArg): ConfigArgDefinition | undefined {
        return this.operationDefinition?.args.find(a => a.name === arg.name);
    }

    private createForm() {
        if (!this.operation) {
            return;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.form = new FormGroup({});
        (this.form as any).__id = Math.random().toString(36).substr(10);

        if (this.operation.args) {
            for (const arg of this.operationDefinition?.args || []) {
                let value: any = this.operation.args.find(a => a.name === arg.name)?.value;
                if (value === undefined) {
                    value = getDefaultConfigArgValue(arg);
                }
                const validators = arg.list ? undefined : arg.required ? Validators.required : undefined;
                this.form.addControl(arg.name, new FormControl(value, validators));
            }
        }

        this.subscription = this.form.valueChanges.subscribe(value => {
            if (this.onChange) {
                this.onChange({
                    code: this.operation && this.operation.code,
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
