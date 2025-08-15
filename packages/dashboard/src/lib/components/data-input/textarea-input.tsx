import { Textarea } from '@/vdb/components/ui/textarea.js';
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';

export function TextareaInput(props: Readonly<DashboardFormComponentProps>) {
    const readOnly = props.disabled || isReadonlyField(props.fieldDef);
    return <Textarea {...props} disabled={readOnly} />;
}
