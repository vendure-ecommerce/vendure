import { APP_INITIALIZER, Component, FactoryProvider, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    ComponentRegistryService,
    CustomField,
    FormInputComponent,
    INPUT_COMPONENT_OPTIONS,
} from '@vendure/admin-ui/core';
import { ElementType } from 'react';
import { ReactComponentHostDirective } from './react-component-host.directive';
import { ReactFormInputProps } from './types';

@Component({
    selector: 'vdr-react-form-input-component',
    template: ` <div [vdrReactComponentHost]="reactComponent" [props]="props"></div> `,
    standalone: true,
    imports: [ReactComponentHostDirective],
})
class ReactFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: string = 'react-form-input-component';
    readonly: boolean;
    formControl: FormControl;
    config: CustomField & Record<string, any>;

    protected props: ReactFormInputProps;

    protected reactComponent = inject(INPUT_COMPONENT_OPTIONS).component;

    ngOnInit() {
        this.props = {
            formControl: this.formControl,
            readonly: this.readonly,
            config: this.config,
        };
    }
}

export function registerReactFormInputComponent(id: string, component: ElementType): FactoryProvider {
    return {
        provide: APP_INITIALIZER,
        multi: true,
        useFactory: (registry: ComponentRegistryService) => () => {
            registry.registerInputComponent(id, ReactFormInputComponent, { component });
        },
        deps: [ComponentRegistryService],
    };
}
