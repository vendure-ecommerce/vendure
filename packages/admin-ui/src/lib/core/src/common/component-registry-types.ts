import { FormControl } from '@angular/forms';

export interface FormInputComponent {
    isListInput?: boolean;
    readonly: boolean;
    formControl: FormControl;
    config: InputComponentConfig;
}

export type InputComponentConfig = {
    component: string;
    [prop: string]: any;
};
