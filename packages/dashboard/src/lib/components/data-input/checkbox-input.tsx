import { Checkbox } from '../ui/checkbox.js';
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';

export function CheckboxInput({ value, onChange, fieldDef }: Readonly<DashboardFormComponentProps>) {
    const readOnly = isReadonlyField(fieldDef);
    return <Checkbox checked={value} onCheckedChange={onChange} disabled={readOnly} />;
}
