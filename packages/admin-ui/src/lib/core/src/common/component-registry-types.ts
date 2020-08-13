import { FormControl } from '@angular/forms';

export interface FormInputComponent<C = InputComponentConfig> {
    isListInput?: boolean;
    readonly: boolean;
    formControl: FormControl;
    config: C;
}

export type InputComponentConfig = {
    [prop: string]: any;
};
