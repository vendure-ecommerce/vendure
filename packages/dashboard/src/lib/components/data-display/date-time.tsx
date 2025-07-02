import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';

export function DateTime({ value }: Readonly<{ value: string | Date }>) {
    const { formatDate } = useLocalFormat();
    let renderedDate: string;
    try {
        renderedDate = formatDate(value);
    } catch (e) {
        renderedDate = value.toString();
        console.error(e);
    }
    return renderedDate;
}
