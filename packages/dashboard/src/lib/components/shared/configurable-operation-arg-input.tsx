import { ConfigurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import { configArgToUniversal } from './universal-field-definition.js';
import { UniversalFormInput } from './universal-form-input.js';

export interface ConfigurableOperationArgInputProps {
    definition: ConfigurableOperationDefFragment['args'][number];
    readOnly?: boolean;
    value: string;
    onChange: (value: any) => void;
    position?: number;
}

export function ConfigurableOperationArgInput({
    definition,
    value,
    onChange,
    readOnly,
    position,
}: Readonly<ConfigurableOperationArgInputProps>) {
    const universalFieldDef = configArgToUniversal(definition);
    return (
        <UniversalFormInput
            fieldDef={universalFieldDef}
            field={{
                value,
                onChange,
                onBlur: () => {},
                name: definition.name,
                ref: () => {},
            }}
            valueMode="json-string"
            disabled={readOnly}
            position={position}
        />
    );
}
