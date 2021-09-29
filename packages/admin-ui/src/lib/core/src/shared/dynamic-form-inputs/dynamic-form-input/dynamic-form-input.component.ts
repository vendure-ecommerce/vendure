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
import { StringCustomFieldConfig } from '@vendure/common/lib/generated-types';
import { ConfigArgType, CustomFieldType, DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { simpleDeepClone } from '@vendure/common/lib/simple-deep-clone';
import { Subject, Subscription } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';

import { FormInputComponent } from '../../../common/component-registry-types';
import { ConfigArgDefinition, CustomFieldConfig } from '../../../common/generated-types';
import { getConfigArgValue } from '../../../common/utilities/configurable-operation-utils';
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
    @Input() def: ConfigArgDefinition | CustomFieldConfig;
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
    private renderList$ = new Subject();
    private destroy$ = new Subject();

    constructor(
        private componentRegistryService: ComponentRegistryService,
        private componentFactoryResolver: ComponentFactoryResolver,
        private changeDetectorRef: ChangeDetectorRef,
        private injector: Injector,
    ) {}

    ngOnInit() {
        const componentId = this.getInputComponentConfig(this.def).component;
        const componentType = this.componentRegistryService.getInputComponent(componentId);
        if (componentType) {
            this.componentType = componentType;
        } else {
            // tslint:disable-next-line:no-console
            console.error(
                `No form input component registered with the id "${componentId}". Using the default input instead.`,
            );
            const defaultComponentType = this.componentRegistryService.getInputComponent(
                this.getInputComponentConfig({ ...this.def, ui: undefined } as any).component,
            );
            if (defaultComponentType) {
                this.componentType = defaultComponentType;
            }
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
                let formArraySub: Subscription | undefined;
                const renderListInputs = (viewContainerRefs: QueryList<ViewContainerRef>) => {
                    if (viewContainerRefs.length) {
                        if (formArraySub) {
                            formArraySub.unsubscribe();
                        }
                        this.listFormArray = new FormArray([]);
                        this.listItems.forEach(i => i.componentRef?.destroy());
                        viewContainerRefs.forEach((ref, i) => {
                            const listItem = this.listItems?.[i];
                            if (listItem) {
                                this.listFormArray.push(listItem.control);
                                listItem.componentRef = this.renderInputComponent(
                                    factory,
                                    ref,
                                    listItem.control,
                                );
                            }
                        });

                        formArraySub = this.listFormArray.valueChanges
                            .pipe(takeUntil(this.destroy$))
                            .subscribe(val => {
                                this.control.markAsTouched();
                                this.control.markAsDirty();
                                this.onChange(val);
                                this.control.patchValue(val, { emitEvent: false });
                            });
                    }
                };

                // initial render
                this.listItemContainers.changes
                    .pipe(take(1))
                    .subscribe(val => renderListInputs(this.listItemContainers));

                // render on changes to the list
                this.renderList$
                    .pipe(
                        switchMap(() => this.listItemContainers.changes.pipe(take(1))),
                        takeUntil(this.destroy$),
                    )
                    .subscribe(() => {
                        renderListInputs(this.listItemContainers);
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
            componentRef.instance.config = this.isConfigArgDef(this.def) ? this.def.ui : this.def;
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
        if (!this.listItems) {
            this.listItems = [];
        }
        this.listItems.push({
            id: this.listId++,
            control: new FormControl((this.def as ConfigArgDefinition).defaultValue ?? null),
        });
        this.renderList$.next();
    }

    moveListItem(event: CdkDragDrop<InputListItem>) {
        if (this.listItems) {
            moveItemInArray(this.listItems, event.previousIndex, event.currentIndex);
            this.listFormArray.removeAt(event.previousIndex);
            this.listFormArray.insert(event.currentIndex, event.item.data.control);
            this.renderList$.next();
        }
    }

    removeListItem(item: InputListItem) {
        if (this.listItems) {
            const index = this.listItems.findIndex(i => i === item);
            item.componentRef?.destroy();
            this.listFormArray.removeAt(index);
            this.listItems = this.listItems.filter(i => i !== item);
            this.renderList$.next();
        }
    }

    private renderInputComponent(
        factory: ComponentFactory<FormInputComponent>,
        viewContainerRef: ViewContainerRef,
        formControl: FormControl,
    ) {
        const componentRef = viewContainerRef.createComponent(factory);
        const { instance } = componentRef;
        instance.config = simpleDeepClone(this.isConfigArgDef(this.def) ? this.def.ui : this.def);
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
        if (Array.isArray(obj)) {
            if (obj.length === this.listItems.length) {
                obj.forEach((value, index) => {
                    const control = this.listItems[index]?.control;
                    control.patchValue(getConfigArgValue(value), { emitEvent: false });
                });
            } else {
                this.listItems = obj.map(
                    value =>
                        ({
                            id: this.listId++,
                            control: new FormControl(getConfigArgValue(value)),
                        } as InputListItem),
                );
                this.renderList$.next();
            }
        } else {
            this.listItems = [];
            this.renderList$.next();
        }
        this.changeDetectorRef.markForCheck();
    }

    private getInputComponentConfig(
        argDef: ConfigArgDefinition | CustomFieldConfig,
    ): { component: DefaultFormComponentId } {
        if (this.hasUiConfig(argDef) && argDef.ui.component) {
            return argDef.ui;
        }
        const type = argDef?.type as ConfigArgType | CustomFieldType;
        switch (type) {
            case 'string':
            case 'localeString': {
                const hasOptions =
                    !!(this.isConfigArgDef(argDef) && argDef.ui?.options) ||
                    !!(argDef as StringCustomFieldConfig).options;
                if (hasOptions) {
                    return { component: 'select-form-input' };
                } else {
                    return { component: 'text-form-input' };
                }
            }
            case 'text': {
                return { component: 'textarea-form-input' };
            }
            case 'int':
            case 'float':
                return { component: 'number-form-input' };
            case 'boolean':
                return { component: 'boolean-form-input' };
            case 'datetime':
                return { component: 'date-form-input' };
            case 'ID':
                return { component: 'text-form-input' };
            case 'relation':
                return { component: 'relation-form-input' };
            default:
                assertNever(type);
        }
    }

    private isConfigArgDef(def: ConfigArgDefinition | CustomFieldConfig): def is ConfigArgDefinition {
        return (def as ConfigArgDefinition)?.__typename === 'ConfigArgDefinition';
    }

    private hasUiConfig(def: unknown): def is { ui: { component: string } } {
        return typeof def === 'object' && typeof (def as any)?.ui?.component === 'string';
    }
}
