import { DashboardCustomFormComponent } from '../extension-api/extension-api-types.js';
import { globalRegistry } from '../registry/global-registry.js';

import { CustomFormComponentInputProps } from './custom-form-component.js';

globalRegistry.register(
    'customFormComponents',
    new Map<string, React.FunctionComponent<CustomFormComponentInputProps>>(),
);

export function getCustomFormComponents() {
    return globalRegistry.get('customFormComponents');
}

export function getCustomFormComponent(
    id: string,
): React.FunctionComponent<CustomFormComponentInputProps> | undefined {
    return globalRegistry.get('customFormComponents').get(id);
}

export function addCustomFormComponent({ id, component }: DashboardCustomFormComponent) {
    const customFormComponents = globalRegistry.get('customFormComponents');
    if (customFormComponents.has(id)) {
        // eslint-disable-next-line no-console
        console.warn(`Custom form component with id "${id}" is already registered and will be overwritten.`);
    }
    customFormComponents.set(id, component);
}
