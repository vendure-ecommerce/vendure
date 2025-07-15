import { Checkbox } from '@/vdb/components/ui/checkbox.js';
import { Trans } from '@/vdb/lib/trans.js';

interface HistoryNoteCheckboxProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export function HistoryNoteCheckbox({ value, onChange }: Readonly<HistoryNoteCheckboxProps>) {
    return (
        <div className="flex items-center space-x-2">
            <Checkbox
                id="note-private"
                checked={value}
                onCheckedChange={checked => onChange(checked as boolean)}
            />
            <label
                htmlFor="note-private"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                <Trans>Note is private</Trans>
            </label>
            <span className={value ? 'text-gray-500 text-xs' : 'text-green-600 text-xs'}>
                {value ? <Trans>Visible to admins only</Trans> : <Trans>Visible to customer</Trans>}
            </span>
        </div>
    );
}
