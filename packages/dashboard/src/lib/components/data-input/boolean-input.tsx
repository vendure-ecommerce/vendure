import { Switch } from '@/vdb/components/ui/switch.js';
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';

export function BooleanInput({ value, onChange, fieldDef }: Readonly<DashboardFormComponentProps>) {
    const checked = typeof value === 'string' ? value === 'true' : value;
    const readOnly = isReadonlyField(fieldDef);
    return <Switch checked={checked} onCheckedChange={onChange} disabled={readOnly} />;
}
