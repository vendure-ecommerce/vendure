import { ConfigurableOperationDefFragment } from "@/graphql/fragments.js";
import { Input } from "../ui/input.js";
import { ConfigArgType } from "@vendure/core";
import { Checkbox } from "../ui/checkbox.js";
import { FacetValueSelector } from "./facet-value-selector.js";
export interface ConfigurableOperationArgInputProps {
    definition: ConfigurableOperationDefFragment['args'][number];
    value: string;
    onChange: (value: any) => void;
}

export function ConfigurableOperationArgInput({ definition, value, onChange }: ConfigurableOperationArgInputProps) {
    if ((definition.ui as any)?.component === 'facet-value-form-input') {
        return <FacetValueSelector onValueSelect={value => onChange(value)} />
    }
    switch (definition.type as ConfigArgType) {
        case 'boolean':
            return <Checkbox value={value} onCheckedChange={state => onChange(state)} />;
        case 'string':
            return <Input value={value} onChange={e => onChange(e.target.value)} />;
        default:
            return <Input value={value} onChange={e => onChange(e.target.value)} />;
    }
}
