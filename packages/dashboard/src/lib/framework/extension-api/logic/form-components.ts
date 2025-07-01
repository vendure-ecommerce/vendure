import { addCustomFormComponent } from '../../form-engine/custom-form-component-extensions.js';
import { addDisplayComponent } from '../display-component-extensions.js';
import { addInputComponent } from '../input-component-extensions.js';
import { DashboardCustomFormComponents, DashboardDisplayComponent } from '../types/form-components.js';

export function registerFormComponentExtensions(
    customFormComponents?: DashboardCustomFormComponents,
    displayComponents?: DashboardDisplayComponent[],
) {
    if (customFormComponents) {
        // Handle custom field components
        if (customFormComponents.customFields) {
            for (const component of customFormComponents.customFields) {
                addCustomFormComponent(component);
            }
        }
        // Handle input components
        if (customFormComponents.inputs) {
            for (const component of customFormComponents.inputs) {
                addInputComponent(component);
            }
        }
    }

    if (displayComponents) {
        for (const component of displayComponents) {
            addDisplayComponent(component);
        }
    }
}
