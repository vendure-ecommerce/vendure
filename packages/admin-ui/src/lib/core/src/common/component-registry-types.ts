import { FormControl } from '@angular/forms';

export interface FormInputComponent {
    readonly: boolean;
    formControl: FormControl;
    config: InputComponentConfig;
}

export type InputComponentConfig = {
    component: string;
    [prop: string]: any;
};
