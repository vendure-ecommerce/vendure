import { addCustomFormComponent } from '../../form-engine/custom-form-component-extensions.js';
import { addDisplayComponent } from '../display-component-extensions.js';
import { addInputComponent } from '../input-component-extensions.js';
import { DashboardCustomFormComponents } from '../types/form-components.js';

export function registerFormComponentExtensions(customFormComponents?: DashboardCustomFormComponents) {
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
        // Handle display components
        if (customFormComponents.displays) {
            for (const component of customFormComponents.displays) {
                addDisplayComponent(component);
            }
        }
    }
}
