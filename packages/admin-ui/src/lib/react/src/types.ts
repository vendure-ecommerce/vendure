import { Injector } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CustomField } from '@vendure/admin-ui/core';

export interface ReactFormInputProps {
    formControl: FormControl;
    readonly: boolean;
    config: CustomField & Record<string, any>;
}

export type HostedReactComponentContext<T extends Record<string, any> = Record<string, any>> = {
    injector: Injector;
} & T;
