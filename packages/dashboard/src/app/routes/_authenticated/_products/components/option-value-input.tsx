import { useFieldArray } from "react-hook-form";
import { useFormContext } from "react-hook-form";
import { useState } from "react";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import { Badge } from "@/components/ui/badge.js";
import { Plus, X } from "lucide-react";

interface OptionValue {
    value: string;
    id: string;
}

interface FormValues {
    optionGroups: {
        name: string;
        values: OptionValue[];
    }[];
    variants: Record<string, {
        enabled: boolean;
        sku: string;
        price: string;
        stock: string;
    }>;
}

interface OptionValueInputProps {
    groupName: string;
    groupIndex: number;
    disabled?: boolean;
}

export function OptionValueInput({ groupName, groupIndex, disabled = false }: OptionValueInputProps) {
    const { control, watch } = useFormContext<FormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: `optionGroups.${groupIndex}.values`,
    });

    const [newValue, setNewValue] = useState('');

    const handleAddValue = () => {
        if (newValue.trim() && !fields.some(f => f.value === newValue.trim())) {
            append({ value: newValue.trim(), id: Date.now().toString() });
            setNewValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddValue();
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Input
                    value={newValue}
                    onChange={e => setNewValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Enter value and press Enter"
                    disabled={disabled}
                    className="flex-1"
                />
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddValue}
                    disabled={disabled || !newValue.trim()}
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {fields.map((field, index) => (
                    <Badge key={field.id} variant="secondary" className="flex items-center gap-1 py-1 px-2">
                        {field.value}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => remove(index)}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}