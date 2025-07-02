import { addCustomFormComponent } from '../../form-engine/custom-form-component-extensions.js';
import { DashboardCustomFormComponents } from '../types/form-components.js';

export function registerFormComponentExtensions(customFormComponents?: DashboardCustomFormComponents) {
    if (customFormComponents) {
        // Handle custom field components
        if (customFormComponents.customFields) {
            for (const component of customFormComponents.customFields) {
                addCustomFormComponent(component);
            }
        }
    }
}
