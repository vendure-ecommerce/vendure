import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    QueryList,
    SimpleChanges,
    Type,
    ViewChild,
    ViewChildren,
    ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, FormArray, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { getConfigArgValue, getDefaultConfigArgSingleValue } from '@vendure/admin-ui/core';
import { ConfigArgType } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { ConfigArgDefinition } from '../../../common/generated-types';
import { ComponentRegistryService } from '../../../providers/component-registry/component-registry.service';

type InputListItem = {
    id: number;
    componentRef?: ComponentRef<FormInputComponent>;
    control: FormControl;
};

/**
 * A host component which delegates to an instance or list of FormInputComponent components.
 */
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
export class DynamicFormInputComponent
    implements OnInit, OnChanges, AfterViewInit, OnDestroy, ControlValueAccessor {
    @Input() def: ConfigArgDefinition;
    @Input() readonly: boolean;
    @Input() control: FormControl;
    @ViewChild('single', { read: ViewContainerRef }) singleViewContainer: ViewContainerRef;
    @ViewChildren('listItem', { read: ViewContainerRef }) listItemContainers: QueryList<ViewContainerRef>;
    renderAsList = false;
    listItems: InputListItem[] = [];
    private singleComponentRef: ComponentRef<FormInputComponent>;
    private listId = 1;
    private listFormArray = new FormArray([]);
    private componentType: Type<FormInputComponent>;
    private onChange: (val: any) => void;
    private onTouch: () => void;
    private destroy$ = new Subject();

    constructor(
        private componentRegistryService: ComponentRegistryService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        private injector: Injector,
    ) {}

    ngOnInit() {
        const componentType = this.componentRegistryService.getInputComponent(
            this.getInputComponentConfig(this.def).component,
        );
        if (componentType) {
            this.componentType = componentType;
        }
    }

    ngAfterViewInit() {
        if (this.componentType) {
            const factory = this.componentFactoryResolver.resolveComponentFactory(this.componentType);

            // create a temp instance to check the value of `isListInput`
            const cmpRef = factory.create(this.injector);
            const isListInputComponent = cmpRef.instance.isListInput ?? false;
            cmpRef.destroy();

            if (this.def.list === false && isListInputComponent) {
                throw new Error(
                    `The ${this.componentType.name} component is a list input, but the definition for ${this.def.name} does not expect a list`,
                );
            }
            this.renderAsList = this.def.list && !isListInputComponent;
            if (!this.renderAsList) {
                this.singleComponentRef = this.renderInputComponent(
                    factory,
                    this.singleViewContainer,
                    this.control,
                );
            } else {
                const arrayValue = Array.isArray(this.control.value)
                    ? this.control.value
                    : !!this.control.value
                    ? [this.control.value]
                    : [];
                this.listItems = arrayValue.map(
                    value =>
                        ({
                            id: this.listId++,
                            control: new FormControl(getConfigArgValue(value)),
                        } as InputListItem),
                );
                let firstRenderHasOccurred = false;
                const renderListInputs = (viewContainerRefs: QueryList<ViewContainerRef>) => {
                    viewContainerRefs.forEach((ref, i) => {
                        const listItem = this.listItems[i];
                        if (!this.listFormArray.controls.includes(listItem.control)) {
                            this.listFormArray.push(listItem.control);
                            listItem.componentRef = this.renderInputComponent(factory, ref, listItem.control);
                        }
                    });
                    firstRenderHasOccurred = true;
                };

                this.listItemContainers.changes
                    .pipe(takeUntil(this.destroy$))
                    .subscribe((refs: QueryList<ViewContainerRef>) => {
                        renderListInputs(refs);
                    });

                this.listFormArray.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(val => {
                    if (firstRenderHasOccurred) {
                        this.control.markAsTouched();
                        this.control.markAsDirty();
                        this.onChange(val);
                    }
                    this.control.patchValue(val, { emitEvent: false });
                });
            }
        }
        setTimeout(() => this.changeDetectorRef.markForCheck());
    }

    ngOnChanges(changes: SimpleChanges) {
        if (this.listItems) {
            for (const item of this.listItems) {
                if (item.componentRef) {
                    this.updateBindings(changes, item.componentRef);
                }
            }
        }
        if (this.singleComponentRef) {
            this.updateBindings(changes, this.singleComponentRef);
        }
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateBindings(changes: SimpleChanges, componentRef: ComponentRef<FormInputComponent>) {
        if ('def' in changes) {
            componentRef.instance.config = this.def.ui;
        }
        if ('readonly' in changes) {
            componentRef.instance.readonly = this.readonly;
        }
        componentRef.injector.get(ChangeDetectorRef).markForCheck();
    }

    trackById(index: number, item: { id: number }) {
        return item.id;
    }

    addListItem() {
        this.listItems.push({
            id: this.listId++,
            control: new FormControl(getDefaultConfigArgSingleValue(this.def.type as ConfigArgType)),
        });
    }

    moveListItem(event: CdkDragDrop<InputListItem>) {
        moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
        this.listFormArray.removeAt(event.previousIndex);
        this.listFormArray.insert(event.currentIndex, event.item.data.control);
    }

    removeListItem(item: InputListItem) {
        const index = this.listItems.findIndex(i => i === item);
        item.componentRef?.destroy();
        this.listFormArray.removeAt(index);
        this.listItems = this.listItems.filter(i => i !== item);
    }

    private renderInputComponent(
        factory: ComponentFactory<FormInputComponent>,
        viewContainerRef: ViewContainerRef,
        formControl: FormControl,
    ) {
        const componentRef = viewContainerRef.createComponent(factory);
        const { instance } = componentRef;
        instance.config = simpleDeepClone(this.def.ui);
        instance.formControl = formControl;
        instance.readonly = this.readonly;
        componentRef.injector.get(ChangeDetectorRef).markForCheck();
        return componentRef;
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
                if (argDef.ui?.options) {
                    return { component: 'select-form-input' };
                } else {
                    return { component: 'text-form-input' };
                }
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
