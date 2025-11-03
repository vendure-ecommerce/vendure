import { getInputComponent } from '@/vdb/framework/extension-api/input-component-extensions.js';

import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';

export function CustomFormComponent(props: DashboardFormComponentProps) {
    if (!props.fieldDef) {
        return null;
    }
    const Component = getInputComponent(props.fieldDef.ui?.component);

    if (!Component) {
        return null;
    }

    return <Component {...props} />;
}
