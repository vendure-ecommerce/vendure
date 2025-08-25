// Simple built-in components using the single DashboardFormComponent interface
import { Input } from '@/vdb/components/ui/input.js';
import { DashboardFormComponent } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';

export const TextInput: DashboardFormComponent = ({ value, onChange, fieldDef }) => {
    const readOnly = isReadonlyField(fieldDef);
    return <Input value={value || ''} onChange={e => onChange(e.target.value)} disabled={readOnly} />;
};
