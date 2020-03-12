import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
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
import { Subscription } from 'rxjs';

import {
    ConfigArg,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    FacetWithValues,
    GetActiveChannel,
    StringFieldOption,
} from '../../../common/generated-types';
import { getDefaultConfigArgValue } from '../../../common/utilities/get-default-config-arg-value';
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
    @Input() facets: FacetWithValues.Fragment[] = [];
    @Input() activeChannel: GetActiveChannel.ActiveChannel;
    @Input() readonly = false;
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

    isIntInput(arg: ConfigArg): boolean {
        if (this.getArgType(arg) === 'int') {
            const config = this.getArgConfig(arg);
            return !!(!config || config.inputType === 'default');
        }
        return false;
    }

    isMoneyInput(arg: ConfigArg): boolean {
        if (this.getArgType(arg) === 'int') {
            const config = this.getArgConfig(arg);
            return !!(config && config.inputType === 'money');
        }
        return false;
    }

    isPercentageInput(arg: ConfigArg): boolean {
        if (this.getArgType(arg) === 'int') {
            const config = this.getArgConfig(arg);
            return !!(config && config.inputType === 'percentage');
        }
        return false;
    }

    isStringWithOptions(arg: ConfigArg): boolean {
        if (this.getArgType(arg) === 'string') {
            return 0 < this.getStringOptions(arg).length;
        }
        return false;
    }

    isStringWithoutOptions(arg: ConfigArg): boolean {
        if (this.getArgType(arg) === 'string') {
            return this.getStringOptions(arg).length === 0;
        }
        return false;
    }

    getStringOptions(arg: ConfigArg): StringFieldOption[] {
        if (this.getArgType(arg) === 'string') {
            const config = this.getArgConfig(arg);
            return (config && config.options) || [];
        }
        return [];
    }

    getArgType(arg: ConfigArg): ConfigArgType {
        return arg.type as ConfigArgType;
    }

    private getArgConfig(arg: ConfigArg): Record<string, any> | undefined {
        if (this.operationDefinition) {
            const match = this.operationDefinition.args.find(argDef => argDef.name === arg.name);
            return match && match.config;
        }
    }

    private createForm() {
        if (!this.operation) {
            return;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.form = new FormGroup({});

        if (this.operation.args) {
            for (const arg of this.operation.args) {
                let value: any = arg.value;
                if (value === undefined) {
                    value = getDefaultConfigArgValue(arg);
                } else {
                    if (arg.type === 'boolean') {
                        value = arg.value === 'true';
                    }
                }
                this.form.addControl(arg.name, new FormControl(value, Validators.required));
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
