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

export function getCustomFormComponent(id: string) {
    return globalRegistry.get('customFormComponents').get(id);
}

export function addCustomFormComponent({ id, component }: DashboardCustomFormComponent) {
    const customFormComponents = globalRegistry.get('customFormComponents');
    customFormComponents.set(id, component);
}
