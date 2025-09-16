import { AffixedInput } from '@/vdb/components/data-input/affixed-input.js';
import { Input } from '@/vdb/components/ui/input.js';

import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';

/**
 * @description
 * A component for displaying a numeric value.
 *
 * @docsCategory form-components
 * @docsPage NumberInput
 */
export function NumberInput({ fieldDef, onChange, ...fieldProps }: Readonly<DashboardFormComponentProps>) {
    const readOnly = fieldProps.disabled || isReadonlyField(fieldDef);
    const isFloat = fieldDef ? fieldDef.type === 'float' : false;
    const min = fieldDef?.ui?.min;
    const max = fieldDef?.ui?.max;
    const step = fieldDef?.ui?.step || (isFloat ? 0.01 : 1);
    const prefix = fieldDef?.ui?.prefix;
    const suffix = fieldDef?.ui?.suffix;
    const shouldUseAffixedInput = prefix || suffix;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (readOnly) return;
        onChange(e.target.valueAsNumber);
    };
    if (shouldUseAffixedInput) {
        return (
            <AffixedInput
                {...fieldProps}
                type="number"
                onChange={handleChange}
                min={min}
                max={max}
                step={step}
                prefix={prefix}
                suffix={suffix}
                className="bg-background"
                disabled={readOnly}
            />
        );
    }

    return (
        <Input
            type="number"
            onChange={handleChange}
            {...fieldProps}
            min={min}
            max={max}
            step={step}
            disabled={readOnly}
        />
    );
}
