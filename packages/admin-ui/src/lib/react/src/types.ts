import { Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BreadcrumbValue, CustomField } from '@vendure/admin-ui/core';
import { Subject } from 'rxjs';

export interface ReactFormInputOptions {
    formControl: FormControl;
    readonly: boolean;
    config: CustomField & Record<string, any>;
}

export interface ReactFormInputProps extends ReactFormInputOptions {}

export interface ReactRouteComponentOptions {
    component: any;
    title$: Subject<string | undefined>;
    breadcrumb$: Subject<BreadcrumbValue>;
    props?: Record<string, any>;
}

export type HostedReactComponentContext<T extends Record<string, any> = Record<string, any>> = {
    injector: Injector;
} & T;
