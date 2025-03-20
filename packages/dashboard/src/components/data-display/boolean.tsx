import { CheckIcon, XIcon } from 'lucide-react';

export function BooleanDisplayCheckbox({ value }: { value: boolean }) {
    return value ? <CheckIcon className="opacity-70" /> : <XIcon className="opacity-70" />;
}
