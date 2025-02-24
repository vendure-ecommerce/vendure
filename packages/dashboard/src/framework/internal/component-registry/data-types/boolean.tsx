import { CheckIcon, XIcon, LucideIcon } from 'lucide-react';

export function BooleanDisplayCheckbox({ value }: { value: boolean }) {
    console.log(`value`, value);
    return value ? <CheckIcon /> : <XIcon />;
}
