import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    forwardRef,
    Input,
    OnChanges,
    SimpleChanges,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormControlName, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { ConfigArg, ConfigArgDefinition } from '../../../common/generated-types';
import { ComponentRegistryService } from '../../../providers/component-registry/component-registry.service';

@Component({
    selector: 'vdr-dynamic-form-input',
    templateUrl: './dynamic-form-input.component.html',
    styleUrls: ['./dynamic-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DynamicFormInputComponent,
            multi: true,
        },
    ],
})
export class DynamicFormInputComponent implements OnChanges, AfterViewInit, ControlValueAccessor {
    @Input() def: ConfigArgDefinition;
    @Input() readonly: boolean;
    @Input() control: FormControl;
    @ViewChild('outlet', { read: ViewContainerRef }) viewContainer: ViewContainerRef;
    private onChange: (val: any) => void;
    private onTouch: () => void;
    private componentRef: ComponentRef<FormInputComponent>;

    constructor(
        private componentRegistryService: ComponentRegistryService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
    ) {}

    ngAfterViewInit() {
        const componentType = this.componentRegistryService.getInputComponent(
            this.getInputComponentConfig(this.def).component,
        );
        if (componentType) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(componentType);
            const componentRef = this.viewContainer.createComponent(factory);
            const { instance } = componentRef;
            this.componentRef = componentRef;
            instance.config = simpleDeepClone(this.def.ui);
            instance.formControl = this.control;
            instance.readonly = this.readonly;
        }
        setTimeout(() => this.changeDetectorRef.markForCheck());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.componentRef) {
            if ('config' in changes) {
                this.componentRef.instance.config = this.def.ui;
            }
            if ('readonly' in changes) {
                this.componentRef.instance.readonly = this.readonly;
            }
            this.componentRef.injector.get(ChangeDetectorRef).markForCheck();
        }
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouch = fn;
    }

    writeValue(obj: any): void {
        /* empty */
    }

    private getInputComponentConfig(argDef: ConfigArgDefinition): InputComponentConfig {
        if (argDef?.ui?.component) {
            return argDef.ui;
        }
        const type = argDef?.type as ConfigArgType;
        switch (type) {
            case 'string':
                return { component: 'text-form-input' };
            case 'int':
            case 'float':
                return { component: 'number-form-input' };
            case 'boolean':
                return { component: 'boolean-form-input' };
            case 'datetime':
                return { component: 'date-form-input' };
            case 'ID':
                return { component: 'string-form-input' };
            default:
                assertNever(type);
        }
    }
}
