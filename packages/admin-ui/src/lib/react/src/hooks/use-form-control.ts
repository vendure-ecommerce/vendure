import { CustomFieldType } from '@vendure/common/lib/shared-types';
import { useContext, useEffect, useState } from 'react';
import { HostedComponentContext } from '../react-component-host.directive';
import { HostedReactComponentContext, ReactFormInputProps } from '../types';

/**
 * @description
 * Provides access to the current FormControl value and a method to update the value.
 */
export function useFormControl() {
    const context = useContext(HostedComponentContext);
    if (!context) {
        throw new Error('No HostedComponentContext found');
    }
    if (!isFormInputContext(context)) {
        throw new Error('useFormControl() can only be used in a form input component');
    }
    const { formControl, config } = context;
    const [value, setValue] = useState(formControl.value ?? 0);

    useEffect(() => {
        const subscription = formControl.valueChanges.subscribe(v => {
            setValue(v);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    function setFormValue(newValue: any) {
        formControl.setValue(coerceFormValue(newValue, config.type as CustomFieldType));
        formControl.markAsDirty();
    }

    return { value, setFormValue };
}

function isFormInputContext(
    context: HostedReactComponentContext,
): context is HostedReactComponentContext<ReactFormInputProps> {
    return context.config && context.formControl;
}

function coerceFormValue(value: any, type: CustomFieldType) {
    switch (type) {
        case 'int':
        case 'float':
            return Number(value);
        case 'boolean':
            return Boolean(value);
        default:
            return value;
    }
}
